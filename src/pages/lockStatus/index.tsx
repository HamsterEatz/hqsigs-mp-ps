import React from 'react';
import { lockDataApi } from '../../apis';
import styles from '../../styles/ParadeState.module.css';
import Link, { useRouter } from 'next/router';
import { promptPassword } from '../../constants';

export async function getServerSideProps({ query }) {
    try {
        return {
            props: {
                data: await lockDataApi(true)
            },
        };
    } catch (e) {
        return {
            props: {
                error: e.message
            }
        }
    }
}

export default function LockStatus({ data, error }) {
    const router = useRouter();
    function onToggleButtonClick() {
        return promptPassword(() => router.push(`lockStatus/toggle?password=${process.env.ADMIN_PASSWORD}`));
    }
    return (
        <div className={styles.container}>
            {error ? error :
                <>
                    <p>Data is currently {!data && 'not'} locked</p>
                    <button onClick={onToggleButtonClick}>Toggle</button>
                </>
            }
        </div>
    );
}
