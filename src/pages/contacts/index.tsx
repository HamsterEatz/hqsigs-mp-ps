import { contactsApi } from '../../apis';
import styles from '../../styles/ParadeState.module.css';

export async function getServerSideProps({ query }) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    let error = 'Access denied';

    if (query.password === adminPassword) {
        try {
            const data = await contactsApi();
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

export default function Contacts({ data, error }) {
    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <span className={styles.state}>
                    {error ? error : data.map(({ rank, name, contact }, i) => {
                        return (
                            <div key={i}>
                                <p>{rank} {name} {contact}</p>
                            </div>
                        );
                    })}
                </span>
            </div>
        </div>
    );
}
