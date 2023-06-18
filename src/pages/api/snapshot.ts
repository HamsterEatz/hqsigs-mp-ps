import { NextApiRequest, NextApiResponse } from "next";
import { snapshotParadeStateApi } from "../../apis";
import { ENV } from "../../constants";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const body = JSON.parse(req.body);
        const password = body.password;
        if (!password || password !== ENV.ADMIN_PASSWORD) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            await snapshotParadeStateApi(Boolean(body.isFirstParade));
            res.status(200).json({ message: 'Snapshot generated' });
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
}