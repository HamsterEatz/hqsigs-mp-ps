import { NextApiRequest, NextApiResponse } from "next";
import { getUsersApi } from "../../apis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;
    switch (method) {
        case 'GET': {
            try {
                const password = req.query.password;
                if (!password || password !== process.env.ADMIN_PASSWORD) {
                    throw new Error("Unauthorised");
                }
                res.status(200).json({ data: await getUsersApi() });
            } catch (e) {
                res.status(403).json({ message: e.message });
            }
        }
    }
}