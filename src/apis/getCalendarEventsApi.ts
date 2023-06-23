import { google } from "googleapis";
import gapiAuth from "./gapiAuth";
import moment from "moment";
import { ENV, PUBLIC_HOLIDAY_CALENDAR_ID } from "../constants";

export default async function getCalendarEvents(startDate) {
    const calendar = await google.calendar({ version: 'v3', auth: gapiAuth() });

    const response1 = await calendar.events.list({
        calendarId: ENV.CALENDAR_ID,
        timeZone: 'Asia/Singapore',
        timeMin: moment(startDate).startOf('week').toISOString(),
        timeMax: moment(startDate).add(4, 'days').toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 5
    });

    const response2 = await calendar.events.list({
        calendarId: PUBLIC_HOLIDAY_CALENDAR_ID,
        timeZone: 'Asia/Singapore',
        timeMin: moment(startDate).startOf('week').toISOString(),
        timeMax: moment(startDate).add(4, 'days').toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 5
    });

    const events = new Map<number, string>();
    const items1 = response1.data.items;
    if (items1 && items1.length > 0) {
        for (const item of items1) {
            const summary = item.summary;
            if (summary) {
                const start = item.start?.dateTime || item.start?.date;
                events.set(moment(start).day(), summary);
            }
        }
    }
    const items2 = response2.data.items;
    if (items2 && items2.length > 0) {
        for (const item of items2) {
            const summary = item.summary;
            if (summary) {
                const start = item.start?.dateTime || item.start?.date;
                events.set(moment(start).day(), summary);
            }
        }
    }

    return events;
}