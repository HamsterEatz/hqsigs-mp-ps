import styles from '../../styles/Calendar.module.css';
import { ENV } from '../../constants';
import moment from 'moment';
import getCalendarEvents from '../../apis/getCalendarEventsApi';

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
    async function onCalendarEventSubmit(e) {
        e.preventDefault();
        const adminPassword = ENV.ADMIN_PASSWORD;
        const passwordClaim = prompt('Enter admin password:');
        if (passwordClaim === null) {
            return;
        }
        if (passwordClaim !== adminPassword) {
            alert('Unauthorized!');
        }
        const { action, name, date, method } = e.target;
        const res = await fetch(action, {
            body: JSON.stringify({
                summary: name.value,
                start: {
                    dateTime: moment(date.value, 'yyyy/MM/DD').toISOString()
                }
            }),
            method: method
        });
        const json = await res.json();
        alert(json.message);
        if (res.ok) {
            location.reload();
        }
    }

    async function onDeleteEventOnClick(event) {
        const adminPassword = ENV.ADMIN_PASSWORD;
        const passwordClaim = prompt('Enter admin password:');
        if (passwordClaim === null) {
            return;
        }
        if (passwordClaim !== adminPassword) {
            alert('Unauthorized!');
        }
        const res = await fetch(`${location.origin}/api/deleteCalendarEvent?eventId=${event.id}`, {
            method: 'DELETE',
        });
        const json = await res.json();
        alert(json.message);
        if (res.ok) {
            location.reload();
        }
    }

    return (
        <div className={styles.container}>
            <h2>Calendar:</h2>
            <div className={styles.grid}>
                <span className={styles.state}>
                    {error ? error : <>
                        <>
                            <h4><b>Events:</b></h4>
                            <form className={styles.form} action="/api/addNewCalendarEvent" method='post' onSubmit={onCalendarEventSubmit}>
                                <div className={styles.formGroup}>
                                    <label htmlFor='name'>Event name:</label>
                                    <input type="name" id="name" placeholder="Enter event name" name="name" required></input>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor='date'>Event date:</label>
                                    <input type="date" id="date" name="date" required></input>
                                </div>
                                <button type="submit" className={styles.createEventButton}>+</button>
                            </form>
                        </>
                        {data.self.map((v, i) => {
                            const startDate = moment(v.start.date || v.start.dateTime, 'yyyy/MM/DD').format('DD/MM/yyyy');
                            return <p key ={i}><button className={styles.deleteEventButton} onClick={() => onDeleteEventOnClick(v)}>×</button>{startDate} → {v.summary}</p>
                        })}
                        <br />
                        {data.publicHoliday.length ? <h4><b>Public Holidays:</b></h4> : <></>}
                        {data.publicHoliday.map((v, i) => {
                            const startDate = moment(v.start.date, 'yyyy/MM/DD').format('DD/MM/yyyy');
                            return <p key ={i}>{startDate} → {v.summary}</p>
                        })}
                    </>}
                </span>
            </div>
        </div>
    );
}
