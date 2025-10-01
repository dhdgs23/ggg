
'use server';

import { isAdminAuthenticated } from '@/app/actions';
import { Notification } from '@/lib/definitions';
import { connectToDatabase } from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';
import { ObjectId } from 'mongodb';

const PAGE_SIZE = 5;

export async function getNotifications(page: number, search: string, sort: string): Promise<{ notifications: Notification[]; hasMore: boolean; total: number }> {
    noStore();
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
        return { notifications: [], hasMore: false, total: 0 };
    }

    try {
        const db = await connectToDatabase();
        const skip = (page - 1) * PAGE_SIZE;

        let query: any = {};
        if (search) {
            query.gamingId = { $regex: search, $options: 'i' };
        }

        const notifications = await db.collection<Notification>('notifications')
            .find(query)
            .sort({ createdAt: sort === 'desc' ? -1 : 1 })
            .skip(skip)
            .limit(PAGE_SIZE)
            .toArray();

        const total = await db.collection('notifications').countDocuments(query);
        const hasMore = skip + notifications.length < total;

        return { notifications: JSON.parse(JSON.stringify(notifications)), hasMore, total };

    } catch (error) {
        console.error("Error fetching notifications:", error);
        return { notifications: [], hasMore: false, total: 0 };
    }
}


export async function deleteNotification(notificationId: string): Promise<{ success: boolean; message: string }> {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
        return { success: false, message: 'Unauthorized' };
    }

    try {
        const db = await connectToDatabase();
        const result = await db.collection('notifications').deleteOne({ _id: new ObjectId(notificationId) });
        if (result.deletedCount === 0) {
            return { success: false, message: 'Notification not found.' };
        }
        revalidatePath('/admin/users-notification');
        return { success: true, message: 'Notification deleted successfully.' };
    } catch (error) {
        console.error("Error deleting notification:", error);
        return { success: false, message: 'An error occurred.' };
    }
}
