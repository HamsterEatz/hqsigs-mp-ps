import styles from '../styles/ParadeState.module.css';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import whatsappSvg from '../public/whatsapp.svg';
import phoneSvg from '../public/phone.svg';
import copySvg from '../public/copy.svg';
import snapshotSvg from '../public/snapshot.svg';
import lockSvg from '../public/lock.svg';
import unlockSvg from '../public/unlock.svg';
import LoadingScreen from './LoadingScreen';

export default function ParadeState({ isFirstParade }) {
    const [isLocked, setIsLocked] = useState(false);
    const [data, setData] = useState<{ present, absent, unaccounted, diffArr, isLocked } | undefined>(undefined);
    const now = moment();
    const key = `${now.format('DD/MM')}-${isFirstParade}`;
    const [nameArrChecked, setNameArrChecked] = useState<any[]>([]);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [loadingTitle, setLoadingTitle] = useState<string>('');
    const [showToolTip, setShowTooltip] = useState(-1);

    async function getParadeState() {
        const res = await fetch(`${location.origin}/api/paradeState?isFirstParade=${isFirstParade}`);
        const json = await res.json();
        const data = json.data;
        setIsLoading(false);
        if (!data) {
            return setError(json.error);
        }
        setData(data);
        setIsLocked(data.isLocked);
    }

    function copyParadeState(e) {
        e.preventDefault();
        if (data) {
            setShowTooltip(-2)
            navigator.clipboard.writeText(setInfoFromData());
            window.setTimeout(() => setShowTooltip(-1), 2000);
        }
    }

    useEffect(() => {
        setLoadingTitle('Fetching parade state...');
        setIsLoading(true);
        getParadeState();
        const presentLocalStorage = localStorage.getItem(key);
        setNameArrChecked(presentLocalStorage ? presentLocalStorage.split(',') : []);
    }, []);

    useEffect(() => {
        if (nameArrChecked.length) {
            return localStorage.setItem(key, nameArrChecked.toString());
        }
    }, [nameArrChecked]);

    async function updateParadeState() {
        const newState = prompt('Enter new state:');
        if (newState) {
            setLoadingTitle(`Updating ${nameArrChecked.length} people's parade state...`);
            setIsLoading(true);
            const res = await fetch(`${location.origin}/api/updateUserParadeState`, {
                method: 'POST',
                body: JSON.stringify({
                    usersData: nameArrChecked.map((ele) => {
                        const rank = ele.split(' ')[0].trim();
                        const name = ele.split(rank)[1].trim();
                        return { rank, name, newState };
                    }),
                    now,
                    isFirstParade,
                })
            });
            setIsLoading(false);
            if (!res.ok) {
                return alert((await res.json()).message);
            }
            setNameArrChecked([]);
            localStorage.removeItem(key);
            location.reload();
        }
        if (newState === '') {
            alert("State cannot be empty!");
        }
    }

    function setInfoFromData(raw = true) {
        if (!data) {
            return;
        }
        const { present, absent, unaccounted } = data;
        let info;

        if (raw) {
            info = `*${now.format('DD/MM/YY')} ${isFirstParade ? 'First' : 'Last'} Parade - Manpower Br*\n\n*Present*:`;
            for (let i = 0; i < present.length; i++) {
                info += `\n${i + 1}) ${present[i].rank} ${present[i].name}`;
            }
            if (absent.length > 0) {
                info += '\n\n*Absent*:';
                for (let i = 0; i < absent.length; i++) {
                    info += `\n${i + 1}) ${absent[i].rank} ${absent[i].name} (${absent[i].state})`;
                }
            }
            if (unaccounted.length > 0) {
                info += '\n\n*Unaccounted*:';
                for (let i = 0; i < unaccounted.length; i++) {
                    const rank = unaccounted[i].rank;
                    const name = unaccounted[i].name;
                    info += `\n${i + 1}) ${rank} ${name}`;
                }
            }
            return info;
        }

        return <>
            <p><b>{`${now.format('DD/MM/YY')} ${isFirstParade ? 'First' : 'Last'} Parade - Manpower Br`}</b></p>
            {nameArrChecked.length >= 1 && <button className={styles.snapshotButton} onClick={() => updateParadeState()}>Update state</button>}
            {present.length > 0 ? <p><b>Present:</b></p> : <></>}
            {present.map((v, i) => (<p key={i}>
                {v.previousMAOrRSO ? <button className={styles.previousMAOrRSO} onClick={() => {
                    setShowTooltip(showToolTip === i ? -1 : i);
                    window.setTimeout(() => setShowTooltip(-1), 2000);
                }}>
                    <b>!</b>
                    {showToolTip === i && <span className={styles.tooltip}>Detected either MA or RSO on FP!</span>}
                </button> : <></>}
                <input type="checkbox" id={`presentInputId${i}`} value={`${v.rank} ${v.name}`} onChange={onStateCheckboxClick} checked={nameArrChecked.find(e => e === `${v.rank} ${v.name}`)} />
                <label htmlFor={`presentInputId${i}`}> {`${i + 1}) ${v.rank} ${v.name}`}</label>
            </p>))}
            {absent.length > 0 ? <><br /><p><b>Absent:</b></p></> : <></>}
            {absent.map((v, i) => (<p key={i}>
                <input type="checkbox" id={`absentInputId${i}`} value={`${v.rank} ${v.name}`} onChange={onStateCheckboxClick} checked={nameArrChecked.find(e => e === `${v.rank} ${v.name}`)} />
                <label htmlFor={`absentInputId${i}`}> {`${i + 1}) ${v.rank} ${v.name} (${v.state})`}</label>
            </p>))}
            {unaccounted.length > 0 ? <><br /><p><b>Unaccounted:</b></p></> : <></>}
            {unaccounted.map((v, i) => (<p key={i}>
                <input type="checkbox" id={`unaccountedInputId${i}`} value={`${v.rank} ${v.name}`} onChange={onStateCheckboxClick} checked={nameArrChecked.find(e => e === `${v.rank} ${v.name}`)} />
                <label htmlFor={`unaccountedInputId${i}`}> {`${i + 1}) ${v.rank} ${v.name}`}</label>
                <a style={{ margin: '0 1rem' }} href={`tel:65${v.contact}`}>
                    <button className={styles.phoneButton} type="button">
                        <Image className={styles.icon} alt="phone" src={phoneSvg} width={10} height={10} />
                    </button>
                </a>
                <button className={styles.whatsappButton} type="button" onClick={() => window.open(`https://wa.me/65${v.contact}`, '_blank')}>
                    <Image className={styles.icon} alt="whatsapp" src={whatsappSvg} width={10} height={10} />
                </button>
            </p>))}
        </>;
    }

    function onStateCheckboxClick(e) {
        const value = e.target.value;
        const isChecked = e.target.checked;
        if (isChecked) {
            setNameArrChecked([...nameArrChecked, value]);
        } else {
            const newArr = nameArrChecked.filter((v) => v !== value);
            if (newArr.length === 0) {
                setNameArrChecked([]);
                return localStorage.removeItem(key);
            }
            setNameArrChecked(newArr);
        }
    }

    async function onLockButtonClick() {
        const password = prompt('Enter admin password to lock parade state sheet:');
        if (password === null) {
            return;
        }
        setLoadingTitle(`${isLocked ? 'Unlocking' : 'Locking'} parade state sheet...`);
        setIsLoading(true);
        const res = await fetch(location.origin + '/api/paradeState/toggleLock', {
            method: 'POST',
            body: JSON.stringify({ password })
        });
        setIsLoading(false);
        if (!res.ok) {
            return alert((await res.json()).message);
        }
        setIsLocked(!isLocked);
    }
    async function onSnapshotButtonClick() {
        const password = prompt('Enter admin password to generate snapshot:');
        if (password === null) {
            return;
        }
        setLoadingTitle("Generating snapshot for parade state...");
        setIsLoading(true);
        const res = await fetch(location.origin + '/api/paradeState/snapshot', {
            method: 'POST',
            body: JSON.stringify({
                password,
                isFirstParade
            })
        });
        setIsLoading(false);
        if (!res.ok) {
            alert((await res.json()).message);
        }
    }

    return (
        <div className={styles.container}>
            {isLoading && <LoadingScreen title={loadingTitle} />}
            <h2>{isFirstParade ? 'First' : 'Last'} Parade State: {data &&
                <>
                    <button onClick={copyParadeState} className={styles.copyButton} type="button" title='Copy'>
                        <Image className={styles.icon} alt="copy" src={copySvg} width={15} height={15} />
                        {showToolTip === -2 && <span className={styles.tooltip}>Copied!</span>}
                    </button>
                    <button className={styles.snapshotButton} title='Snapshot' onClick={onSnapshotButtonClick}><Image className={styles.icon} alt="snapshot" src={snapshotSvg} width={15} height={15} /></button>
                    <button title='Lock' className={isLocked ? styles.unlockButton : styles.lockButton} onClick={onLockButtonClick}>{isLocked ?
                        <Image className={styles.icon} alt="unlock" src={unlockSvg} width={15} height={15} />
                        : <Image className={styles.icon} alt="lock" src={lockSvg} width={15} height={15} />}
                    </button>
                </>}
            </h2>
            <div className={styles.grid}>
                <span className={styles.state}>
                    {data ? <>
                        {data.unaccounted && data.unaccounted.length > 0 && <h2 style={{ color: '#dc3545' }}><b>WARNING: UNACCOUNTED DETECTED!</b></h2>}
                        {data.diffArr.length > 0 && <>
                            <h4 style={{ color: 'darkred' }}><b>Detected changes from snapshot:</b></h4>
                            {data.diffArr.map(({ name, rank, oldState, newState }, i) => {
                                return (<p key={i}>
                                    {i + 1}) {rank} {name} [{oldState} → {newState}]
                                </p>);
                            })}
                            <hr />
                            <br />
                        </>}
                        <>{setInfoFromData(false)}</>
                    </> : error ? error : 'Loading...'}
                </span>
            </div>
        </div>
    );
}
