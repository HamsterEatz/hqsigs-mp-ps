import { useRouter } from 'next/router';
import { getUsersApi } from '../../apis';
import { ENV, RANKS } from '../../constants';
import styles from '../../styles/Users.module.css';
import Image from 'next/image';
import whatsappSvg from '../../public/whatsapp.svg';
import phoneSvg from '../../public/phone.svg';
import { useEffect, useState } from 'react';

export async function getServerSideProps({ query }) {
    const adminPassword = ENV.ADMIN_PASSWORD;
    let error = 'Access denied';

    if (query.password === adminPassword) {
        try {
            const data = await getUsersApi();
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

export default function Users({ data, error }) {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        setUsers(data);
    }, data);

    const router = useRouter();
    async function onDeleteButtonClick(value) {
        const { rank, name, userId } = value;
        if (confirm(`Are you sure you want to delete ${rank} ${name}?`)) {
            const data = await fetch(location.origin + '/api/removeUser', {
                method: 'POST',
                body: JSON.stringify({userId})
            });

            alert((await data.json()).message);
            if (data.ok) {
                return router.reload();
            }
        }
    }

    return (
        <div className={styles.container}>
            <h2>Users:</h2>
            <div className={styles.grid}>
                <div className={styles.state}>
                    {error ? error : <>
                        <form className={styles.form} action="/api/addUser" method='post'>
                            <div className={styles.formGroup}>
                                <label htmlFor='rank'>Rank:</label>
                                <select id="rank" name="rank" required>
                                    {Object.values(RANKS).map((rank, i) => (
                                        <option key={i} value={rank}>{rank}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor='name'>Name:</label>
                                <input type="name" id="name" placeholder="Enter name" name="name" required></input>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor='contact'>Contact:</label>
                                <input type="contact" id="contact" placeholder="Enter contact" name="contact" pattern='(8|9)\d{7}' required></input>
                            </div>
                            <button type="submit" className={styles.submitButton}>Add</button>
                        </form>
                        {users.map((v, i) => (
                            <p key={v.userId}>
                                <button className={styles.deleteButton} style={{ marginRight: '.5rem' }} onClick={() => onDeleteButtonClick(v)}>×</button>
                                {`${i + 1}) ${v.rank} ${v.name}`}
                                <a style={{ margin: '0 1rem' }} href={`tel:65${v.contact}`}>
                                    <button className={styles.phoneButton} type="button">
                                        <Image className={styles.icon} alt="phone" src={phoneSvg} width={10} height={10} />
                                    </button>
                                </a>
                                <button className={styles.whatsappButton} type="button" onClick={() => window.open(`https://wa.me/65${v.contact}`, '_blank')}>
                                    <Image className={styles.icon} alt="whatsapp" src={whatsappSvg} width={10} height={10} />
                                </button>
                            </p>
                        ))}
                    </>}
                </div>
            </div>
        </div>
    );
}
