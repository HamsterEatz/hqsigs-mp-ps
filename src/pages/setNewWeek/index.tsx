import styles from '../../styles/ParadeState.module.css';
import { setNewWeekApi } from '../../apis';
import moment from 'moment';
import { ENV } from '../../constants';

export async function getServerSideProps({ query }) {
    const adminPassword = ENV.ADMIN_PASSWORD;
    let error = 'Access denied';
    const now = moment();

    if (query.password === adminPassword) {
        try {
            if ((now.day() !== 0 && now.day() < 5) || (now.day() === 5 && now.hours() < 17)) {
                throw new Error('You can only set new week from Friday 1700hrs - Sunday 2359hrs!');
            }
            await setNewWeekApi(now);
            return {
                props: {
                    data: 'Sheet has been updated!'
                }
            }
        } catch (e) {
            error = e.message;
        }
    }

    return {
        props: {
            error
        }
    }
}

export default function SetNewWeek({ data, error }) {
    return (
        <div className={styles.container}>
            <h2>Set new week:</h2>
            <div className={styles.grid}>
                <span className={styles.state}>
                    {error ? error : data}
                </span>
            </div>
        </div>
    );
}
