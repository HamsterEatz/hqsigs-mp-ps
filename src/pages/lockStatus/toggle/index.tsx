import React, { useEffect } from 'react';
import { lockDataApi } from '../../../apis';
import styles from '../../../styles/ParadeState.module.css';
import { useRouter } from 'next/router';

export async function getServerSideProps({ query }) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    let error = 'Access denied';

    if (query.password === adminPassword) {
        try {
            const data = await lockDataApi(false);
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

export default function FirstParade({ data, error }) {
    const router = useRouter();
    useEffect(() => {
        if (!error && data !== null) {
            let count = 2;
            const int = setInterval(() => (
                document.getElementById("counter")!!.innerHTML = `${count--} seconds left...`
            ), 1000);
            setTimeout(() => {
                clearInterval(int);
                router.replace('../../');
            }, 4000);
        }
    }, []);
    return (
        <div className={styles.container}>
            {error ? error :
                <>
                    <p>Data is now {!data && 'not'} locked</p>
                    <p id="counter">3 seconds left...</p>
                </>
            }
        </div>
    );
}
