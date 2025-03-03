import config from '@/config';
import { revalidateTag } from 'next/cache';
import cron from 'node-cron';

let isCronInitialized = false;

function getCronSchedule(): string {
    const genesisDate = new Date(config.genesisDate);
    const epochDuration = config.epochDurationInSeconds;

    if (epochDuration === 86400) {
        // 24-hour epoch → Run daily at genesis hour + one minute
        const genesisHourUTC = genesisDate.getUTCHours();
        return `1 ${genesisHourUTC} * * *`;
    } else if (epochDuration === 3600) {
        // 1-hour epoch → Run every hour at one minute past the hour
        return `1 * * * *`;
    } else {
        throw new Error('Unsupported epoch duration');
    }
}

if (!isCronInitialized) {
    isCronInitialized = true;

    const cronSchedule = getCronSchedule();
    console.log(`[cron] Scheduled to run at: ${cronSchedule}`);

    cron.schedule(cronSchedule, async () => {
        try {
            console.log(`[cron | ${new Date().toISOString()}] Running cron jobs`);
            revalidateTag('r1-minted-last-epoch');
        } catch (error) {
            console.error('[cron]', error);
        }
    });
}
