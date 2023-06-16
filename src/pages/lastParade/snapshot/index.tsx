import { snapshotParadeStateApi } from '../../../apis';
import styles from '../../../styles/ParadeState.module.css';

export async function getServerSideProps({ query }) {
    try {
        const data = await snapshotParadeStateApi(false);
        return {
            props: {
                data
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

export default function SnapshotFirstParade({ data, error }) {
    return (
        <div className={styles.container}>
            <h2>Snapshot:</h2>
            <div className={styles.grid}>
                <span className={styles.state}>
                    {error ? error : <p>Snapshot generated!</p>}
                </span>
            </div>
        </div>
    );
}
