import moment from "moment";
import { google } from 'googleapis';
import gapiAuth from "./gapiAuth";
import getUsersApi from "./getUsersApi";
import { LEGENDS, SHEET } from "../constants";

export default async function paradeStateApi(isFirstParade, now: moment.Moment = moment()) {
    const currentDay = now.day();
    if (currentDay === 0 || currentDay === 6) {
        throw new Error('Parade State not available on weekends!');
    }

    const sheets = google.sheets({ version: 'v4', auth: gapiAuth() });

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${SHEET.PARADE_STATE}!A4:O`,
    });

    const values = response.data.values || [];

    return filterData({ now, isFirstParade, values });
}

async function filterData({ now, isFirstParade, values }) {
    let present: any = [];
    let absent: any = [];
    let unaccounted: any = [];
    for (const value of values) {
        const name = value[1];
        const rank = value[2];
        if (!isNaN(Number(value[0])) && name) {
            const currentDay = now.day();
            const paradeIndex = currentDay * 2 + (isFirstParade ? 2 : 3);
            const state = value[paradeIndex]?.trim();
            if (state) {
                if (state.toUpperCase() === LEGENDS.PRESENT) {
                    if (!isFirstParade) {
                        const previousValue = value[paradeIndex - 1]?.trim().toUpperCase();
                        if (previousValue === 'MA' || previousValue === 'RSO') {
                            present.push({ name, rank, previousMAOrRSO: true });
                            continue;
                        }
                    }

                    present.push({ name, rank });
                } else {
                    if (state?.includes("from")) {
                        absent.push({ name, rank, state });
                        continue;
                    }

                    const remarks = value[14];
                    if (remarks?.includes("from")) {
                        let isAppended = false;
                        for (const legend of Object.values(LEGENDS.ABSENT)) {
                            if (state.toUpperCase() === legend) {
                                const dateRange = remarks.split("from ")[1];
                                const splittedDates = dateRange.split("-");
                                const startDate = moment(splittedDates[0], 'DD/MM');
                                const endDate = moment(splittedDates[1], 'DD/MM');

                                if (now.isBetween(startDate, endDate) || now.isSame(startDate, 'day') || now.isSame(endDate, 'day')) {
                                    absent.push({ name, rank, state: remarks });
                                    isAppended = true;
                                }
                                break;
                            }
                        }
                        if (isAppended) {
                            continue;
                        }
                    }

                    // Calculate duration
                    let hasDuration = false;
                    for (const legend of Object.values(LEGENDS.ABSENT)) {
                        if (state.toUpperCase() === legend) {
                            let daysToSubtractToStartDate = 0;
                            let daysToAddToEndDate = 0;

                            // Calculate startDate
                            for (let y = currentDay * 2 + (isFirstParade ? 1 : 2); y > 3; y--) {
                                if (!value[y] || value[y].trim().toUpperCase() !== legend || y === 4) {
                                    const startDay = Math.floor((y - 1) / 2);
                                    daysToSubtractToStartDate = currentDay - startDay;
                                    break;
                                }
                            }

                            // Calculate endDate
                            for (let y = currentDay * 2 + (isFirstParade ? 3 : 4); y < 14; y++) {
                                if (!value[y] || value[y].trim().toUpperCase() !== legend || y === 13) {
                                    const endDay = Math.floor((y - 3) / 2);
                                    daysToAddToEndDate = endDay - currentDay;
                                    break;
                                }
                            }

                            const startDate = now.clone().subtract(daysToSubtractToStartDate, 'days');
                            const endDate = now.clone().add(daysToAddToEndDate, 'days');

                            hasDuration = true;
                            absent.push({ rank, name, state: `${state} from ${startDate.format('DD/MM')}-${endDate.format('DD/MM')}` });
                            break;
                        }
                    }
                    if (hasDuration) {
                        continue;
                    }

                    absent.push({ rank, name, state });
                }
            } else {
                let contact = '';
                const contactList = await getUsersApi();
                for (const currentContact of contactList) {
                    if (currentContact.name === name && currentContact.rank === rank) {
                        contact = currentContact.contact;
                        break;
                    }
                }
                unaccounted.push({ name, rank, contact });
            }
        }
    }

    return { present, absent, unaccounted };
}
