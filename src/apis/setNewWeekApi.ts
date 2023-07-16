import { google } from "googleapis";
import gapiAuth from "./gapiAuth";
import moment from "moment";
import clearDataApi from "./clearDataApi";
import { SHEET, SHEET_TYPE, valueInputOption } from "../constants";
import getCalendarEventsApi from "./getCalendarEventsApi";
import getSheetByName from "./getSheetByName";

export default async function setNewWeekApi(now: moment.Moment = moment()) {
    try {
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        let start: moment.Moment;
        // If Sunday, use same week
        if (now.day() === 0) {
            start = now;
        } else {
            start = now.add(1, 'week').startOf('week');
        }

        const sheets = google.sheets({ version: 'v4', auth: gapiAuth() });

        // Check based on the current start date, if the date range is already updated
        const currentStartDateResponse = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${SHEET.PARADE_STATE}!E2`,
        });
        const currentStartDateString = currentStartDateResponse.data.values!![0][0];
        const currentStartDate = moment(currentStartDateString).year(start.year());
        const isUpdated = currentStartDate.isSame(start.clone().add(1, 'day'), 'date');
        if (isUpdated) {
            throw new Error('Unable to update as sheet was already updated!');
        }

        await clearDataApi(SHEET_TYPE.PARADE_STATE);

        const paradeStateSheet = await getSheetByName(SHEET.PARADE_STATE);
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
                requests: [{
                    repeatCell: {
                        fields: 'userEnteredFormat(backgroundColor)',
                        range: {
                            sheetId: paradeStateSheet.properties?.sheetId,
                            startRowIndex: 0,
                            startColumnIndex: 0,
                        },
                        cell: {
                            userEnteredFormat: {
                                backgroundColor: { red: 1, green: 1, blue: 1 }
                            }
                        }
                    }
                }]
            }
        });

        const startToEnd = start.clone();
        const datesArr: string[] = [];
        for (let i = 0; i < 9; i++) {
            datesArr.push(i % 2 === 0 ? startToEnd.add(1, 'day').format('DD/MM/yyyy') : '');
        }
        // After this 'for' loop 'startToEnd' is now at the end


        const remarksResponse = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${SHEET.PARADE_STATE}!O4:O`,
        });

        const remarks: any[] = remarksResponse.data.values!!;
        const dataToAppend: any[] = [];
        const remarksCellToClear: string[] = [];
        start.add(1, 'day');
        for (let i = 0; i < remarks.length; i++) {
            const remark = remarks[i][0];
            if (remark && remark.includes('from')) {
                const dateRange = remark.split("from ")[1];
                const splittedDates = dateRange.split("-");
                const endDate = moment(splittedDates[1], 'DD/MM');
                if (endDate.isSameOrAfter(start, 'days')) {
                    let numOfColToAppend = (endDate.diff(start, 'days') + 1) * 2;
                    numOfColToAppend = numOfColToAppend <= 10 ? numOfColToAppend : 10;
                    const remarksArr: any[] = [];
                    for (let y = 0; y < numOfColToAppend; y++) {
                        remarksArr.push(remark);
                    }
                    dataToAppend.push({ range: `${SHEET.PARADE_STATE}!R${4 + i}C5:R${4 + i}C${4 + numOfColToAppend}`, values: [remarksArr] });
                } else {
                    remarksCellToClear.push(`${SHEET.PARADE_STATE}!N${4 + i}`);
                }
            }
        }

        await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId,
            requestBody: {
                valueInputOption: valueInputOption, data: [
                    {
                        range: `${SHEET.PARADE_STATE}!E2:N2`,
                        values: [datesArr]
                    },
                    ...dataToAppend
                ]
            }
        });

        await sheets.spreadsheets.values.batchClear({
            spreadsheetId,
            requestBody: {
                ranges: remarksCellToClear
            }
        });

        const { self, publicHoliday } = await getCalendarEventsApi(start);
        const events = new Map<number, { summary: string, isHalfDay: boolean }>();
        if (self && self.length > 0) {
            for (const item of self) {
                const summary = item?.summary;
                if (summary) {
                    const start = item.start?.dateTime || item.start?.date;
                    const end = item.end?.dateTime || item.end?.date;
                    const isHalfDay = moment(start).diff(end, 'day') !== 1 ? true : false;
                    events.set(moment(start).day(), { summary, isHalfDay });
                }
            }
        }
        if (publicHoliday && publicHoliday.length > 0) {
            for (const item of publicHoliday) {
                const summary = item.summary;
                if (summary) {
                    const start = item.start?.dateTime || item.start?.date;
                    events.set(moment(start).day(), { summary, isHalfDay: false });
                }
            }
        }
        if (events.size <= 0) {
            return;
        }

        await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
                requests: Array.from(events.keys()).map((k) => ({
                    repeatCell: {
                        fields: 'userEnteredFormat(backgroundColor)',
                        range: {
                            sheetId: paradeStateSheet.properties?.sheetId,
                            startRowIndex: 1,
                            startColumnIndex: (Number(k) * 2) + (events.get(k)?.isHalfDay ? 3 : 2),
                            endColumnIndex: (Number(k) * 2) + 4
                        },
                        cell: {
                            userEnteredFormat: {
                                backgroundColor: { red: 1, green: 38, blue: 153 }
                            }
                        }
                    }
                }))
            }
        });
    } catch (e) {
        throw e;
    }
}
