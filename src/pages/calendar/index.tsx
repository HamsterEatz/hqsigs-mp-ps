import styles from '../../styles/Calendar.module.css';
import moment from 'moment';
import getCalendarEvents from '../../apis/getCalendarEventsApi';
import LoadingScreen from '../../components/LoadingScreen';
import { useState } from 'react';

export async function getServerSideProps({ query }) {

    try {
        return {
            props: {
                data: await getCalendarEvents()
            }
        }
    } catch (e) {
        return {
            props: {
                error: e.message
            }
        }
    }
}

export default function Calendar({ data, error }) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingTitle, setLoadingTitle] = useState<string>('');

    async function onCalendarEventSubmit(e) {
        e.preventDefault();
        const passwordClaim = prompt('Enter admin password:');
        if (passwordClaim === null) {
            return;
        }
        const { action, name, date, isHalfDay, method } = e.target;
        setLoadingTitle(`Adding ${name.value} event to the calendar...`);
        setIsLoading(true);
        const res = await fetch(action, {
            body: JSON.stringify({
                summary: name.value,
                start: {
                    dateTime: moment(date.value, 'yyyy/MM/DD').toISOString()
                },
                isHalfDay: isHalfDay.checked,
                password: passwordClaim
            }),
            method: method
        });
        setIsLoading(false);
        if (!res.ok) {
            return alert((await res.json()).message);
        }
        location.reload();
    }

    async function onDeleteEventOnClick(event) {
        const passwordClaim = prompt('Enter admin password:');
        if (passwordClaim === null) {
            return;
        }
        setLoadingTitle(`Deleting ${event.summary} event from calendar...`);
        setIsLoading(true);
        const res = await fetch(`${location.origin}/api/calendar/event?eventId=${event.id}&password=${passwordClaim}`, {
            method: 'DELETE',
        });
        setIsLoading(false);
        if (!res.ok) {
            return alert((await res.json()).message);
        }
        location.reload();
    }

    return (
        <div className={styles.container}>
            {isLoading && <LoadingScreen title={loadingTitle} />}
            <h2>Calendar:</h2>
            <div className={styles.grid}>
                <span className={styles.state}>
                    {error ? error : <>
                        <>
                            <h4><b>Events:</b></h4>
                            <form className={styles.form} action="/api/calendar/event" method='post' onSubmit={onCalendarEventSubmit}>
                                <div className={styles.formGroup}>
                                    <label htmlFor='name'>Event name:</label>
                                    <input type="name" id="name" placeholder="Enter event name" name="name" required></input>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor='isHalfDay'>Is Half Day?</label>
                                    <input type="checkbox" id='isHalfDay' />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor='date'>Event date:</label>
                                    <input type="date" id="date" name="date" required></input>
                                </div>
                                <button type="submit" className={styles.createEventButton}>+</button>
                            </form>
                        </>
                        {data.self.map((v, i) => {
                            const startDate = moment(v.start.date || v.start.dateTime, 'yyyy/MM/DD');
                            const endDate = moment(v.end.date || v.end.dateTime, 'yyyy/MM/DD');
                            const diff = endDate.diff(startDate, 'day');
                            return <p key={i}><button className={styles.deleteEventButton} onClick={() => onDeleteEventOnClick(v)}>×</button>{diff !== 1 ? '(Half day)' : ''} {startDate.format('DD/MM/yyyy')} → {v.summary}</p>
                        })}
                        <br />
                        {data.publicHoliday.length ? <h4><b>Public Holidays:</b></h4> : <></>}
                        {data.publicHoliday.map((v, i) => {
                            const startDate = moment(v.start.date || v.start.dateTime, 'yyyy/MM/DD');
                            return <p key={i}>{startDate.format('DD/MM/yyyy')} → {v.summary}</p>
                        })}
                    </>}
                </span>
            </div>
        </div>
    );
}
