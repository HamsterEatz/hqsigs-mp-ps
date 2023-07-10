import { NextApiRequest, NextApiResponse } from "next";
import { compareParadeStateApi, lockDataApi, paradeStateApi } from "../../../apis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;
    switch (method) {
        case 'GET': {
            try {
                const isFirstParade = String(req.query.isFirstParade).toLowerCase() === 'true';
                const state = await paradeStateApi(isFirstParade);
                const diffArr = await compareParadeStateApi(true, state) || [];
                const isLocked = await lockDataApi(true);
                return res.status(200).json({ data: { diffArr, ...state, isLocked } });
            } catch (e) {
                return res.status(401).json({ error: e.message });
            }
        }
    }
}