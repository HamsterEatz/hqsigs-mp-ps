import { google } from "googleapis";
import gapiAuth from "./gapiAuth";

export default async function deleteCalendarEventApi(eventId) {
    const calendar = google.calendar({ version: 'v3', auth: gapiAuth() });

    const res = await calendar.events.delete({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        eventId
    });

    return res.data;
}