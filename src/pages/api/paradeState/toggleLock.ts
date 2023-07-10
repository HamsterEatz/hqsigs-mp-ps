import { NextApiRequest, NextApiResponse } from "next";
import { lockDataApi } from "../../../apis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const password = JSON.parse(req.body).password;
            if (!password || password !== process.env.ADMIN_PASSWORD) {
                throw new Error('Unauthorized');
            }
            const isLocked = await lockDataApi(false);
            res.status(203).json({ message: `Parade state is now ${isLocked ? 'locked' : 'unlocked'}!` });
        } catch (e) {
            res.status(403).json({ message: e.message });
        }
    }
}