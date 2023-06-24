import { google } from "googleapis";
import gapiAuth from "./gapiAuth";
import { ENV } from "../constants";
import moment from "moment";

interface EventI {
    summary: string;
    location?: string;
    description?: string;
    start: {
        dateTime: string;
    }
}

export default async function addNewCalendarEventApi(event: EventI) {
    const startDate = event.start.dateTime;
    if (moment(startDate).isBefore(moment())) {
        throw new Error('Cannot create event with start date before now!');
    }
    
    const calendar = await google.calendar({ version: 'v3', auth: gapiAuth() });

    const currList = await calendar.events.list({
        calendarId: ENV.CALENDAR_ID,
        timeZone: 'Asia/Singapore',
        timeMin: moment(startDate).startOf('day').toISOString(),
        timeMax: moment(startDate).add(1, 'day').startOf('day').toISOString(),
        singleEvents: true,
        maxResults: 1
    });

    const currEvent = await currList.data.items;
    if (currEvent && currEvent.length > 0) {
        throw new Error('Cannot overwrite an existing event!');
    }

    const response = await calendar.events.insert({
        calendarId: ENV.CALENDAR_ID,
        requestBody: {
            ...event,
            start: {
                dateTime: moment(startDate).startOf('day').toISOString(),
                timeZone: "Asia/Singapore"
            },
            end: {
                dateTime: moment(startDate).add(1, 'day').startOf('day').toISOString(),
                timeZone: "Asia/Singapore"
            },
        }
    });

    return response.data.status;
}