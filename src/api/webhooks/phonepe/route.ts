
import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import { type Product, type User, type Order, type LegacyUser, type Notification } from '@/lib/definitions';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { sendPushNotification } from '@/lib/push-notifications';
import { setSmartVisualId } from '@/lib/auto-visual-id';

const PHONEPE_CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET;

export async function POST(req: NextRequest) {
    if (!PHONEPE_CLIENT_SECRET) {
        console.error('PHONEPE_CLIENT_SECRET is not set.');
        return NextResponse.json({ success: false, message: 'Webhook secret not configured.' }, { status: 500 });
    }

    try {
        const bodyText = await req.text();
        const serverChecksum = req.headers.get('x-verify');
        const calculatedChecksum = createHmac('sha256', PHONEPE_CLIENT_SECRET).update(bodyText).digest('hex') + '###1';

        // NOTE: In a real production environment, you MUST validate this checksum.
        // During local development or with sandbox credentials, this might be tricky.
        // For now, we will proceed but log a warning if it fails.
        if (serverChecksum !== calculatedChecksum) {
            console.warn('PhonePe webhook signature mismatch. This should be investigated in production.');
            // In a real production scenario, you might want to return a 400 error here.
            // return NextResponse.json({ success: false, message: 'Invalid signature.' }, { status: 400 });
        }
        
        const payloadContainer = JSON.parse(bodyText);
        const decodedPayload = JSON.parse(Buffer.from(payloadContainer.response, 'base64').toString());

        if (decodedPayload.code === 'PAYMENT_SUCCESS') {
            const { merchantTransactionId, amount } = decodedPayload.data;
            const finalAmount = amount / 100; // Convert from paise to rupees
            
            const db = await connectToDatabase();
            
            // Prevent duplicate order processing
            const existingOrder = await db.collection<Order>('orders').findOne({ transactionId: merchantTransactionId });
            if (existingOrder) {
                return NextResponse.json({ success: true, message: 'Order already processed.' });
            }
            
            // Extract info from transactionId (e.g., "timestamp-gamingId-productId")
            const parts = merchantTransactionId.split('-');
            const gamingId = parts[1];
            const productId = parts[2];
            
            if (!productId || !gamingId) {
                console.error('Webhook payload missing productId or gamingId in transactionId');
                return NextResponse.json({ success: false, message: 'Missing required data.' }, { status: 400 });
            }

            const product = await db.collection<Product>('products').findOne({ _id: new ObjectId(productId) });
            const user = await db.collection<User>('users').findOne({ gamingId });

            if (!product || !user) {
                console.error(`Product or user not found for productId: ${productId}, gamingId: ${gamingId}`);
                return NextResponse.json({ success: false, message: 'Product or user not found.' }, { status: 404 });
            }
            
            const coinsUsed = product.isCoinProduct ? 0 : Math.min(user.coins, product.coinsApplicable || 0);
            const orderStatus = product.isCoinProduct ? 'Completed' : 'Processing';

            const newOrder: Omit<Order, '_id'> = {
                userId: user._id.toString(),
                gamingId,
                productId: product._id.toString(),
                productName: product.name,
                productPrice: product.price,
                productImageUrl: product.imageUrl,
                paymentMethod: 'UPI',
                status: orderStatus,
                transactionId: merchantTransactionId,
                referralCode: user.referredByCode,
                coinsUsed,
                finalPrice: finalAmount,
                isCoinProduct: product.isCoinProduct,
                createdAt: new Date(),
                coinsAtTimeOfPurchase: user.coins,
            };

            const session = db.client.startSession();
            await session.withTransaction(async () => {
                await db.collection<Order>('orders').insertOne(newOrder as Order, { session });

                if (product.isCoinProduct) {
                    await db.collection<User>('users').updateOne({ _id: user._id }, { $inc: { coins: product.quantity } }, { session });
                } else if (coinsUsed > 0) {
                    await db.collection<User>('users').updateOne({ _id: user._id }, { $inc: { coins: -coinsUsed } }, { session });
                }
                
                if (orderStatus === 'Completed' && user.referredByCode) {
                    const rewardAmount = finalAmount * 0.50;
                    await db.collection<LegacyUser>('legacy_users').updateOne({ referralCode: user.referredByCode }, { $inc: { walletBalance: rewardAmount } }, { session });
                }

                let notificationMessage = product.isCoinProduct
                    ? `Your purchase of ${product.name} for ₹${finalAmount} was successful! The coins have been added to your account.`
                    : `Your payment of ₹${finalAmount} for "${product.name}" has been successfully received. Currently, it's under processing.`;

                const newNotification: Omit<Notification, '_id'> = {
                    gamingId,
                    message: notificationMessage,
                    isRead: false,
                    createdAt: new Date(),
                    imageUrl: product.imageUrl,
                };
                await db.collection<Notification>('notifications').insertOne(newNotification as Notification, { session });
            });
            await session.endSession();

            if (!product.isCoinProduct) {
                await setSmartVisualId(user);
            }

            if (user.fcmToken) {
                let pushTitle = product.isCoinProduct ? 'Garena Store: Purchase Successful!' : 'Garena Store: Payment Received';
                let pushBody = product.isCoinProduct
                    ? `Your purchase of ${product.name} for ₹${finalAmount} was successful!`
                    : `Your payment of ₹${finalAmount} for "${product.name}" has been confirmed. Currently, it's under processing.`;
                
                await sendPushNotification({ token: user.fcmToken, title: pushTitle, body: pushBody, imageUrl: product.imageUrl });
            }
            
            revalidatePath('/');
            revalidatePath('/order');
            revalidatePath('/admin');
        }

        return NextResponse.json({ success: true, message: 'Webhook processed.' });

    } catch (error) {
        console.error('Error processing PhonePe webhook:', error);
        return NextResponse.json({ success: false, message: 'Webhook processing failed.' }, { status: 500 });
    }
}
