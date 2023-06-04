import styles from '../../styles/ParadeState.module.css';
import { setNewWeekApi } from '../../apis';


export async function getServerSideProps({ query }) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    let error = 'Access denied';

    if (query.password === adminPassword) {
        try {
            const data = await setNewWeekApi();
            return {
                props: {
                    data
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
