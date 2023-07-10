import moment from "moment";
import { setNewWeekApi } from "../../../apis";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            try {
                const password = req.query.password;
                if (!password || password !== process.env.ADMIN_PASSWORD) {
                    throw new Error('Unauthorized');
                }
                const innerRes = await fetch(`http://${req.headers.host}/api/paradeState/setNewWeek`, {
                    body: JSON.stringify({ password }),
                    method: 'POST'
                });
                return res.status(innerRes.status).json(await innerRes.json());
            } catch (e) {
                res.status(403).json({ message: e.message });
            }
        }
        case 'POST': {
            try {
                const password = JSON.parse(req.body).password;
                if (!password || password !== process.env.ADMIN_PASSWORD) {
                    throw new Error('Unauthorized');
                }
                const now = moment();
                if ((now.day() !== 0 && now.day() < 5) || (now.day() === 5 && now.hours() < 17)) {
                    throw new Error('You can only set new week from Friday 1700hrs - Sunday 2359hrs!');
                }
                await setNewWeekApi(now);
                res.status(200).json({ message: 'Sheet has been updated!' });
            } catch (e) {
                res.status(403).json({ message: e.message });
            }
        }
    }
}