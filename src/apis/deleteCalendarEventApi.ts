import { google } from "googleapis";
import gapiAuth from "./gapiAuth";
import { ENV } from "../constants";

export default async function deleteCalendarEventApi(eventId) {
    const calendar = google.calendar({ version: 'v3', auth: gapiAuth() });

    const res = await calendar.events.delete({
        calendarId: ENV.CALENDAR_ID,
        eventId
    });

    return res.data;
}