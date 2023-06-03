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
}