export function promptPassword(onSuccess) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    const passwordInput = prompt('Enter admin password');
    if (passwordInput === adminPassword) {
        return onSuccess();
    }
    return alert('Access denied!');
}

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
    CONTACT_LIST: 'Contact List',
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