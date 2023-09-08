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

export const PUBLIC_HOLIDAY_CALENDAR_ID = 'en.singapore.official#holiday@group.v.calendar.google.com';

export enum RANKS {
    REC = 'REC',
    PTE = 'PTE',
    LCP = 'LCP',
    CPL = 'CPL',
    CFC = 'CFC',
    THIRDSG = '3SG'
}

export function getRankHierarchy(rank) {
    switch (rank) {
        case RANKS.REC:
            return 1;
        case RANKS.PTE:
            return 2;
        case RANKS.LCP:
            return 3;
        case RANKS.CPL:
            return 4;
        case RANKS.CFC:
            return 5;
        case RANKS.THIRDSG:
            return 6;
        default:
            return -1;
    }
}

export const valueInputOption = 'USER_ENTERED';
export const TELEGRAM_BOT_BASE_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/`;