'use server';

import { isAdminAuthenticated } from '@/app/actions';
import { VisualIdPromotionLog } from '@/lib/definitions';
import { connectToDatabase } from '@/lib/mongodb';
import { unstable_noStore as noStore } from 'next/cache';

const PAGE_SIZE = 10;

export async function getPromotedIdLogs(search: string, page: number, sort: string) {
    noStore();
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
        return { logs: [], hasMore: false };
    }

    let query: any = {};
    if (search) {
        query.$or = [
            { oldGamingId: { $regex: search, $options: 'i' } },
            { newGamingId: { $regex: search, $options: 'i' } }
        ];
    }
    
    try {
        const db = await connectToDatabase();
        const skip = (page - 1) * PAGE_SIZE;

        const logsFromDb = await db.collection<VisualIdPromotionLog>('visual_id_promotions')
            .find(query)
            .sort({ promotionDate: sort === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(PAGE_SIZE)
            .toArray();
            
        const totalLogs = await db.collection('visual_id_promotions').countDocuments(query);
        const hasMore = skip + logsFromDb.length < totalLogs;
        
        const logs = JSON.parse(JSON.stringify(logsFromDb));

        return { logs, hasMore };
    } catch (error) {
        console.error("Error fetching promoted ID logs:", error);
        return { logs: [], hasMore: false };
    }
}
