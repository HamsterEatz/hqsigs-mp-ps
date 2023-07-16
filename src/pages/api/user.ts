import { NextApiRequest, NextApiResponse } from "next";
import { addUserApi, modifyUserRankApi, removeUserApi } from "../../apis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;
    switch (method) {
        case 'POST': {
            try {
                const body = JSON.parse(req.body);
                const { name, rank, contact, password } = body;
                if (!password || password !== process.env.ADMIN_PASSWORD) {
                    throw new Error("Unauthorised");
                }
                if (!name && !rank && !contact) {
                    throw new Error('Name, rank and contact not found!');
                }
                await addUserApi({ name, rank, contact });
                return res.status(201).json({ message: `Added ${rank} ${name} with contact (${contact})` });
            } catch (e) {
                res.status(403).send({ message: e.message });
            }
        }
        case 'PUT': {
            try {
                const { user, isPromote, password } = JSON.parse(req.body);
                if (!password || password !== process.env.ADMIN_PASSWORD) {
                    throw new Error("Unauthorised");
                }
                const { rank, name } = user;
                await modifyUserRankApi(user, isPromote);
                res.status(201).json({ message: `${isPromote ? 'Promoted' : 'Demoted'} ${rank} ${name}!` });
            } catch (e) {
                return res.status(400).json({ message: e.message });
            }
        }
        case 'DELETE': {
            try {
                const { userId, password } = req.query;
                if (!password || password !== process.env.ADMIN_PASSWORD) {
                    throw new Error("Unauthorised");
                }
                if (!userId) {
                    throw new Error('UserId not detected!');
                }
                await removeUserApi(Number(userId));
                res.status(204).json({ message: `Removed ${userId}'th user` });
            } catch (e) {
                res.status(400).json({ message: e.message });
            }
        }
    }
}