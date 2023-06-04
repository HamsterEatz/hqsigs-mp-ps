import { google } from "googleapis";
import gapiAuth from "./gapiAuth";
import moment from "moment";
import clearDataApi from "./clearDataApi";

export default async function setNewWeekApi() {
    try {
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;
        const now = moment();

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
            range: 'Parade State (1)!D2',
        });
        const currentStartDateString = currentStartDateResponse.data.values!![0][0];
        const currentStartDate = moment(currentStartDateString).year(start.year());
        const isUpdated = currentStartDate.isSame(start.clone().add(1, 'day'), 'date');
        if (isUpdated) {
            return 'Sheet has already been updated!';
        }

        await clearDataApi();

        const startToEnd = start.clone();
        const datesArr: string[] = [];
        for (let i = 0; i < 9; i++) {
            datesArr.push(i % 2 === 0 ? startToEnd.add(1, 'day').format('DD/MM/yyyy') : '');
        }
        // After this 'for' loop 'startToEnd' is now at the end


        const remarksResponse = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Parade State (1)!N4:N',
        });

        const remarks: any[] = remarksResponse.data.values!!;
        const dataToAppend: any[] = [];
        for (let i = 0; i < remarks.length; i++) {
            const remark = remarks[i][0];
            if (remark && remark.includes('from')) {
                const dateRange = remark.split("from ")[1];
                const splittedDates = dateRange.split("-");
                const endDate = moment(splittedDates[1], 'DD/MM');
                if (endDate.isSameOrAfter(start)) {
                    let numOfColToAppend = (endDate.diff(start, 'days') + 1) * 2;
                    numOfColToAppend = numOfColToAppend <= 10 ? numOfColToAppend : 10;
                    const remarksArr: any[] = [];
                    for (let y = 0; y < numOfColToAppend; y++) {
                        remarksArr.push(remark);
                    }
                    dataToAppend.push({ range: `Parade State (1)!R${4 + i}C4:R${4 + i}C${3 + numOfColToAppend}`, values: [remarksArr] });
                }
            }
        }

        await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId,
            requestBody: {
                valueInputOption: 'USER_ENTERED', data: [
                    {
                        range: 'Parade State (1)!D2:M2',
                        values: [datesArr]
                    },
                    ...dataToAppend
                ]
            }
        });

        return 'Sheet has been updated!';
    } catch (e) {
        throw e;
    }
}