import { useRouter } from 'next/router';
import { RANKS } from '../../constants';
import styles from '../../styles/Users.module.css';
import Image from 'next/image';
import whatsappSvg from '../../public/whatsapp.svg';
import phoneSvg from '../../public/phone.svg';
import { useEffect, useState } from 'react';
import LoadingScreen from '../../components/LoadingScreen';

export default function Users() {
    const [collapsedId, setCollapsedId] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingTitle, setLoadingTitle] = useState<string>('');
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState('');

    const router = useRouter();

    async function getUsersFromApi() {
        const passwordClaim = prompt('Enter admin password');
        if (passwordClaim === null || passwordClaim === '') {
            return router.back();
        }
        setLoadingTitle("Getting users...");
        setIsLoading(true);
        const res = await fetch(`${location.origin}/api/users?password=${passwordClaim}`);
        const json = await res.json();
        const data = json.data;
        setIsLoading(false);
        !data ? setError(json.message) : setData(data);
    }

    useEffect(() => {
        getUsersFromApi();
    }, []);

    async function onDeleteButtonClick(value) {
        const { rank, name, userId } = value;
        const passwordClaim = prompt(`Enter admin password to delete ${rank} ${name}.`);
        if (passwordClaim === null) {
            return;
        }
        setLoadingTitle(`Removing ${rank} ${name}...`);
        setIsLoading(true);
        const data = await fetch(`${location.origin}/api/user?userId=${userId}&password=${passwordClaim}`, {
            method: 'DELETE',
        });
        setIsLoading(false);
        if (!data.ok) {
            return alert((await data.json()).message);
        }
        router.reload();
    }

    async function modifyRankOnButtonClick(value, isPromote) {
        const { rank, name, userId } = value;
        const passwordClaim = prompt(`Enter admin password ${isPromote ? 'promote' : 'demote'} ${rank} ${name}.`);
        if (passwordClaim === null) {
            return;
        }
        setLoadingTitle(`${isPromote ? 'Promoting' : 'Demoting'} ${rank} ${name}...`);
        setIsLoading(true);
        const data = await fetch(`${location.origin}/api/user`, {
            method: 'PUT',
            body: JSON.stringify({ user: { id: userId, rank, name }, isPromote, password: passwordClaim })
        });
        setIsLoading(false);
        if (!data.ok) {
            return alert((await data.json()).message);
        }
        router.reload();
    }

    async function onAddUserFormSubmission(e) {
        e.preventDefault();
        const passwordClaim = prompt('Enter admin password');
        if (passwordClaim === null) {
            return;
        }
        const { action, name, contact, rank, method } = e.target;
        setLoadingTitle(`Adding ${rank.value} ${name.value} entry to parade state...`);
        setIsLoading(true);
        const res = await fetch(action, {
            body: JSON.stringify({
                name: name.value,
                contact: contact.value,
                rank: rank.value,
                password: passwordClaim
            }),
            method: method
        });
        setIsLoading(false);
        if (!res.ok) {
            return alert((await res.json()).message);
        }
        router.reload();
    }

    return (
        <div className={styles.container}>
            {isLoading && <LoadingScreen title={loadingTitle} />}
            <h2>Users:</h2>
            <div className={styles.grid}>
                <div className={styles.state}>
                    {data ? <>
                        <form className={styles.form} action="/api/user" method='post' onSubmit={onAddUserFormSubmission}>
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
                            <button type="submit" className={styles.submitButton}>+</button>
                        </form>
                        {data && data.map((v, i) => (
                            <div className={styles.collapsible} key={v.userId} onClick={() => setCollapsedId(collapsedId === i ? -1 : i)}>
                                <div>{`${i + 1}) ${v.rank} ${v.name}`}</div>
                                {collapsedId === i ? <div className={styles.collapsibleGroup}>
                                    <div className={styles.collapsibleItem}>
                                        <button className={styles.deleteButton} onClick={() => onDeleteButtonClick(v)}>×</button>
                                    </div>
                                    <div className={styles.collapsibleItem}>
                                        <button className={styles.modifyRankButton} onClick={() => modifyRankOnButtonClick(v, true)}>ᐱ</button>
                                    </div>
                                    <div className={styles.collapsibleItem}>
                                        <button className={styles.modifyRankButton} onClick={() => modifyRankOnButtonClick(v, false)}>ᐯ</button>
                                    </div>
                                    <div className={styles.collapsibleItem}>
                                        <a href={`tel:65${v.contact}`}>
                                            <button className={styles.phoneButton} type="button">
                                                <Image className={styles.icon} alt="phone" src={phoneSvg} width={10} height={10} />
                                            </button>
                                        </a>
                                    </div>
                                    <div className={styles.collapsibleItem}>
                                        <button className={styles.whatsappButton} type="button" onClick={() => window.open(`https://wa.me/65${v.contact}`, '_blank')}>
                                            <Image className={styles.icon} alt="whatsapp" src={whatsappSvg} width={10} height={10} />
                                        </button>
                                    </div>
                                </div> : <></>}
                            </div>
                        ))}
                    </> : error}
                </div>
            </div>
        </div>
    );
}
