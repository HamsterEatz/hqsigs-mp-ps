import { NextApiRequest, NextApiResponse } from "next";
import { addNewCalendarEventApi, deleteCalendarEventApi } from "../../../apis";
import moment from "moment";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;
    switch (method) {
        case 'POST': {
            try {
                const body = JSON.parse(req.body);
                const password = body.password;
                if (!password || password !== process.env.ADMIN_PASSWORD) {
                    throw new Error('Unauthorized');
                }
                await addNewCalendarEventApi(body);
                return res.status(201).json({ message: `${body.summary} added on ${moment(body.start.dateTime).format('DD/MM/yyyy')}!` });
            } catch (e) {
                return res.status(403).json({ message: e.message });
            }
        }
        case 'DELETE': {
            try {
                const { eventId, password } = req.query;
                if (!password || password !== process.env.ADMIN_PASSWORD) {
                    throw new Error('Unauthorized');
                }
                await deleteCalendarEventApi(eventId);
                return res.status(204).json({ message: 'Event deleted!' });
            } catch (e) {
                return res.status(403).json({ message: e.message });
            }
        }
    }
}