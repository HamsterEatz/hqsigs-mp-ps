import { google } from "googleapis";
import gapiAuth from "./gapiAuth";
import { ENV, SHEET } from "../constants";

export default async function fetchAndOrToggleLockDataApi(fetchOnly = true) {
    const sheets = google.sheets({ version: 'v4', auth: gapiAuth() });

    const spreadsheetId = ENV.SPREADSHEET_ID;
    const CLIENT_EMAIL = ENV.CLIENT_EMAIL || "";
    const OP_EMAILS = ENV.OPS_EMAIL!!.split(",");

    const fetchSheetsResponse = await sheets.spreadsheets.get({
        spreadsheetId,
    });

    const currSheets = fetchSheetsResponse.data.sheets;
    let sheetId;
    let protectedRangeId;
    const rangeDescription = 'Disable edit';
    for (const sheet of currSheets || []) {
        if (sheet.properties?.title === SHEET.PARADE_STATE) {
            sheetId = sheet.properties.sheetId;
            for (const range of sheet.protectedRanges || []) {
                if (range.description === rangeDescription) {
                    protectedRangeId = range.protectedRangeId;
                    break;
                }
            }
            break;
        }
    }

    if (fetchOnly) {
        return protectedRangeId ? true : false;
    }

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [
                protectedRangeId ? {
                    deleteProtectedRange: {
                        protectedRangeId
                    }
                } : {
                    addProtectedRange: {
                        protectedRange: {
                            range: {
                                sheetId,
                                startRowIndex: 3,
                                startColumnIndex: 4,
                                endColumnIndex: 14,
                            },
                            description: rangeDescription,
                            editors: {
                                users: [CLIENT_EMAIL, ...OP_EMAILS]
                            }
                        },
                    }
                }
            ]
        }
    });

    return protectedRangeId ? false : true;
}