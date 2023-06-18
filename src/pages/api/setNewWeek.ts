import moment from "moment";
import { setNewWeekApi } from "../../apis";
import { ENV } from "../../constants";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const password = JSON.parse(req.body).password;
        if (!password || password !== ENV.ADMIN_PASSWORD) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const now = moment();
        if ((now.day() !== 0 && now.day() < 5) || (now.day() === 5 && now.hours() < 17)) {
            throw new Error('You can only set new week from Friday 1700hrs - Sunday 2359hrs!');
        }
        try {
            await setNewWeekApi(now);
            res.status(200).json({ message: 'Sheet has been updated!' });
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
}