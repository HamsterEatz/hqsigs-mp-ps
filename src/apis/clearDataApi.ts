import { google } from "googleapis";
import gapiAuth from "./gapiAuth";
import { SHEET, SHEET_TYPE } from "../constants";

export default async function clearDataApi(sheetType: string) {
    let range: string = '';

    switch (sheetType) {
        case SHEET_TYPE.PARADE_STATE: {
            range = `${SHEET.PARADE_STATE}!D4:M`;
            break;
        }
        case SHEET_TYPE.SNAPSHOT: {
            range = SHEET.PARADE_STATE_SNAPSHOT;
            break;
        }
    }

    const sheets = google.sheets({ version: 'v4', auth: gapiAuth() });

        const response = await sheets.spreadsheets.values.clear({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range,
        });
    
        return response.data.clearedRange;
}
