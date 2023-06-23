import { google } from "googleapis";
import gapiAuth from "./gapiAuth";
import { ENV, SHEET } from "../constants";
import getSheetByName from "./getSheetByName";

export default async function fetchAndOrToggleLockDataApi(fetchOnly = true) {
    const sheets = google.sheets({ version: 'v4', auth: gapiAuth() });

    const spreadsheetId = ENV.SPREADSHEET_ID;
    const CLIENT_EMAIL = ENV.CLIENT_EMAIL || "";
    const OP_EMAILS = ENV.OPS_EMAIL!!.split(",");

    const sheet = await getSheetByName(SHEET.PARADE_STATE);
    let protectedRangeId;
    const rangeDescription = 'Disable edit';
    for (const range of sheet.protectedRanges || []) {
        if (range.description === rangeDescription) {
            protectedRangeId = range.protectedRangeId;
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
                                sheetId: sheet.properties?.sheetId,
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