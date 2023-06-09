import { NextApiRequest, NextApiResponse } from "next";
import { snapshotParadeStateApi } from "../../../apis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const body = JSON.parse(req.body);
            const password = body.password;
            if (!password || password !== process.env.ADMIN_PASSWORD) {
                throw new Error('Unauthorized');
            }
            await snapshotParadeStateApi(Boolean(body.isFirstParade));
            res.status(200).json({ message: 'Snapshot generated' });
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
}