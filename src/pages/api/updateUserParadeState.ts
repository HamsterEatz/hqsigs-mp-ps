import { NextApiRequest, NextApiResponse } from "next";
import { ENV } from "../../constants";
import { updateUserParadeStateApi } from "../../apis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const body = JSON.parse(req.body);
        const { password, now, rank, name, isFirstParade, newState } = body;
        if (!password || password !== ENV.ADMIN_PASSWORD) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            await updateUserParadeStateApi({ rank, name, isFirstParade, newState, now });
            res.status(200).json({ message: `Updated ${rank} ${name} parade state to ${newState}` });
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
}