import schedule from 'node-schedule';
import { User } from '../models/userModel.js';

const checkFreeTrialStatus = async () => {
    try {
        const currentDate = new Date();

        const usersToUpdate = await User.find({
            isInFreeTrial: true,
            freeTrialEndDate: { $lt: currentDate },
            stripeSubscriptionId: { $in: [null, '', undefined] },
        });

        for (const user of usersToUpdate) {
            user.isInFreeTrial = false;
            user.isPremium = false;
            await user.save();

            console.log(`Free trial ended for user: ${user.email}`);
        }
    } catch (error) {
        console.error('Error in free trial check job:', error);
    }
};

// Schedule the job to run daily at midnight
export const scheduleFreeTrialCheck = () => {
    schedule.scheduleJob('0 0 * * *', checkFreeTrialStatus);
    console.log('Free trial check job scheduled');
};
