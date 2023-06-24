import { NextApiRequest, NextApiResponse } from "next";
import { deleteCalendarEventApi } from "../../apis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        try {
            const calRes = await deleteCalendarEventApi(req.query.eventId);
            return res.status(200).json({ message: 'Event deleted!' });
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }
}