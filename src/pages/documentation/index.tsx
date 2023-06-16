import { fetchDocsApi } from '../../apis';
import styles from '../../styles/ParadeState.module.css';

export async function getServerSideProps({ query }) {
    try {
        return {
            props: {
                data: await fetchDocsApi()
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

export default function Documentation({ data, error }) {
    return (
        <div className={styles.container}>
            <h2>Documentation:</h2>
            <div className={styles.grid}>
                <div className={styles.state}>
                    {error ? error : <div dangerouslySetInnerHTML={{ __html: data }} />}
                </div>
            </div>
        </div>
    );
}
