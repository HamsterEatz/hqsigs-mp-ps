import { NextApiRequest, NextApiResponse } from "next";
import { ENV } from "../../constants";
import { lockDataApi } from "../../apis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const password = JSON.parse(req.body).password;
        if (!password || password !== ENV.ADMIN_PASSWORD) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const isLocked = await lockDataApi(false);
            res.status(200).json({ message: `Parade state is now ${isLocked ? 'locked' : 'unlocked'}!` });
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
}