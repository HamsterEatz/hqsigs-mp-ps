export const LEGENDS = {
    PRESENT: 'PRESENT',
    ABSENT: {
        MC: 'MC',
        HL: 'HL',
        CL: 'CL',
        LEAVE: 'LEAVE',
        OL: 'OL',
        PGR_OFF: 'PGR OFF',
        WP_OFF: 'WP OFF',
        MOB_OFF: 'MOB OFF',
        OFF: 'OFF'
    },
    UNACCOUNTED: 'UNACCOUNTED',
}

export const SHEET = {
    PARADE_STATE: 'Parade State (1)',
    PARADE_STATE_SNAPSHOT: '(SNAPSHOT) Parade State'
}

export enum SHEET_TYPE {
    PARADE_STATE = 'PARADE STATE',
    SNAPSHOT = 'SNAPSHOT'
}

export enum DOC_ALIGNMENT {
    CENTER = 'CENTER',
    END = 'END'
}

export const ENV = {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    SPREADSHEET_ID: process.env.GOOGLE_SHEET_ID,
    DOCUMENT_ID: process.env.GOOGLE_DOCS_ID,
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
    PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    OPS_EMAIL: process.env.GOOGLE_OP_EMAILS,
    CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID
}

export const PUBLIC_HOLIDAY_CALENDAR_ID = 'en.singapore#holiday@group.v.calendar.google.com';

export enum RANKS {
    REC = 'REC',
    PTE = 'PTE',
    LCP = 'LCP',
    CPL = 'CPL',
    CFC = 'CFC',
    THIRDSG = '3SG'
}
