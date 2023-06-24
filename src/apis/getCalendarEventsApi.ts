import { google } from "googleapis";
import gapiAuth from "./gapiAuth";
import moment from "moment";
import { ENV, PUBLIC_HOLIDAY_CALENDAR_ID } from "../constants";

export default async function getCalendarEvents(startDate?) {
    const calendar = await google.calendar({ version: 'v3', auth: gapiAuth() });

    const response1 = await calendar.events.list({
        calendarId: ENV.CALENDAR_ID,
        timeZone: 'Asia/Singapore',
        timeMin: startDate ? moment(startDate).startOf('week').toISOString() : moment().toISOString(),
        timeMax: startDate ? moment(startDate).add(4, 'days').toISOString() : undefined,
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: startDate ? 5 : undefined
    });

    const response2 = await calendar.events.list({
        calendarId: PUBLIC_HOLIDAY_CALENDAR_ID,
        timeZone: 'Asia/Singapore',
        timeMin: startDate ? moment(startDate).startOf('week').toISOString() : moment().toISOString(),
        timeMax: startDate ? moment(startDate).add(4, 'days').toISOString() : undefined,
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: startDate ? 5 : undefined
    });

    return { self: response1.data.items, publicHoliday: response2.data.items };
}