import { google } from 'googleapis';
import gapiAuth from "./gapiAuth";
import { ENV, SHEET, SHEET_TYPE } from "../constants";
import moment from 'moment';
import clearDataApi from './clearDataApi';

export default async function snapshotParadeStateApi(isFirstParade: boolean, now: moment.Moment = moment()) {
    const currentDay = now.day();
    if (currentDay === 0 || currentDay === 6) {
        throw new Error('Snapshots cannot be generated on the weekend!');
    }

    const colIndexToCopy = currentDay * 2 + (isFirstParade ? 3 : 4);
    const colToCopy = String.fromCharCode(64 + colIndexToCopy);
    
    const sheets = google.sheets({ version: 'v4', auth: gapiAuth() });
    const spreadsheetId = ENV.SPREADSHEET_ID;
    
    const paradeStateSheet = await sheets.spreadsheets.values.batchGet({
        spreadsheetId,
        ranges: [`${SHEET.PARADE_STATE!}!B4:C`, `${SHEET.PARADE_STATE}!${colToCopy}4:$${colToCopy}`]
    });

    await clearDataApi(SHEET_TYPE.SNAPSHOT);

    const psData = paradeStateSheet.data.valueRanges;
    const response = await sheets.spreadsheets.values.update({
        spreadsheetId,
        valueInputOption: 'USER_ENTERED',
        range: SHEET.PARADE_STATE_SNAPSHOT,
        requestBody: {
            values: [
                [`${now.format('DD/MM')} ${isFirstParade ? 'First' : 'Last'} Parade`],
                ...psData!![0].values!!.map((v, i) => {
                const data = psData!![1].values!![i];
                v.push(data ? data[0] : '');
                return v;
            }) as any[]
        ]
        }
    });

    return response.data.updatedCells;
}