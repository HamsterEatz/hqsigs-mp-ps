import styles from '../styles/ParadeState.module.css';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import Image from 'next/image';
import whatsappSvg from '../public/whatsapp.svg';
import phoneSvg from '../public/phone.svg';
import copySvg from '../public/copy.svg';
import snapshotSvg from '../public/snapshot.svg';
import lockSvg from '../public/lock.svg';
import unlockSvg from '../public/unlock.svg';
import { ENV } from '../constants';

export default function ParadeState({ isFirstParade, data, error }) {
    const [showModal, setShowModal] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const now = moment();
    const key = `${now.format('DD/MM')}-${isFirstParade}`;
    const [currPresentArr, setCurrPresentArr] = useState<any[]>([]);

    function copyParadeState(e) {
        e.preventDefault();
        if (data) {
            let copyButton = document.getElementById('copyToClipboardTooltip');
            copyButton!!.style.visibility = 'visible';
            navigator.clipboard.writeText(setInfoFromData());
            window.setTimeout(() => copyButton!!.style.visibility = 'hidden', 2000);
            if (data.unaccounted.length > 0) {
                setShowModal(true);
            }
        }
    }

    useEffect(() => {
        const presentLocalStorage = localStorage.getItem(key);
        setCurrPresentArr(presentLocalStorage ? presentLocalStorage.split(',') : []);
    }, []);

    useEffect(() => {
        if (currPresentArr.length) {
            return localStorage.setItem(key, currPresentArr.toString());
        }
    }, [currPresentArr]);

    useEffect(() => {
        if (data) {
            setInfoFromData(data);
            setIsLocked(data.isLocked);
        }
    }, [data]);

    async function updateParadeState({ rank, name }) {
        const adminPassword = prompt("Enter admin password");
        if (adminPassword !== ENV.ADMIN_PASSWORD) {
            return alert('Unauthorised!');
        }
        const newState = prompt(`Enter new state ${rank} ${name}:`);
        const res = await fetch(`${location.origin}/api/updateUserParadeState`, {
            method: 'POST',
            body: JSON.stringify({
                rank,
                name,
                now,
                isFirstParade,
                newState,
                password: adminPassword
            })
        });
        alert((await res.json()).message);
    }

    function setInfoFromData(raw = true) {
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
                setShowModal(true);
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
            {present.length > 0 ? <p><b>Present:</b></p> : <></>}
            {present.map((v, i) => (
                <p key={i}>
                    <input type="checkbox" id={`presentInputId${i}`} value={`${v.rank} ${v.name}`} onChange={onPresentCheckboxClick} checked={currPresentArr.find(e => e === `${v.rank} ${v.name}`)} />
                    <label htmlFor={`presentInputId${i}`}> {`${i + 1}) ${v.rank} ${v.name}`}</label>
                    <button className={styles.snapshotButton} onClick={() => updateParadeState(v)}>Update state</button>
                    <br />  
                </p>
            ))}
            {absent.length > 0 ? <><br/><p><b>Absent:</b></p></> : <></>}
            {absent.map((v, i) => (<p key={i}>{i + 1}) {v.rank} {v.name}</p>))}
            {unaccounted.length > 0 ? <><br/><p><b>Unaccounted:</b></p></> : <></>}
            {unaccounted.map((v, i) => (<p key={i}>{i + 1}) {v.rank} {v.name}</p>))}
        </>;
    }

    function onPresentCheckboxClick(e) {
        const value = e.target.value;
        const isChecked = e.target.checked;
        if (isChecked) {
            setCurrPresentArr([...currPresentArr, value]);
        } else {
            const newArr = currPresentArr.filter((v) => v !== value);
            if (newArr.length === 0) {
                setCurrPresentArr([]);
                return localStorage.removeItem(key);
            }
            setCurrPresentArr(newArr);
        }
    }

    async function onLockButtonClick() {
        const password = prompt('Enter admin password');
        const res = await fetch(location.origin + '/api/toggleLock', {
            method: 'POST',
            body: JSON.stringify({ password })
        });
        setIsLocked(!isLocked);
        alert((await res.json()).message);
    }
    async function onSnapshotButtonClick() {
        const password = prompt('Enter admin password');
        const res = await fetch(location.origin + '/api/snapshot', {
            method: 'POST',
            body: JSON.stringify({
                password,
                isFirstParade
            })
        });
        alert((await res.json()).message);
    }

    return (
        <div className={styles.container}>
            <div>
                {showModal &&
                    <Modal title={<b style={{ color: '#dc3545' }}>Unaccounted Detected!</b>} onClose={() => setShowModal(false)}>
                        {data.unaccounted.map(({ rank, name, contact }, i) => (
                            <p key={i}>{i + 1}) {rank} {name} ({contact})
                                <a style={{ margin: '0 1rem' }} href={`tel:65${contact}`}>
                                    <button className={styles.phoneButton} type="button">
                                        <Image className={styles.icon} alt="phone" src={phoneSvg} width={10} height={10} />
                                    </button>
                                </a>
                                <button className={styles.whatsappButton} type="button" onClick={() => window.open(`https://wa.me/65${contact}`, '_blank')}>
                                    <Image className={styles.icon} alt="whatsapp" src={whatsappSvg} width={10} height={10} />
                                </button>
                            </p>
                        ))}
                    </Modal>
                }
            </div>
            <h2>{isFirstParade ? 'First' : 'Last'} Parade State: {!error &&
                <>
                    <button onClick={copyParadeState} className={styles.copyButton} type="button"><Image className={styles.icon} alt="copy" src={copySvg} width={15} height={15} />
                        <span id="copyToClipboardTooltip" className={styles.copyButtonTooltip}>Copied!</span>
                    </button>
                    <button className={styles.snapshotButton} onClick={onSnapshotButtonClick}><Image className={styles.icon} alt="snapshot" src={snapshotSvg} width={15} height={15} /></button>
                    <button className={isLocked ? styles.unlockButton : styles.lockButton} onClick={onLockButtonClick}>{isLocked ? 
                        <Image className={styles.icon} alt="unlock" src={unlockSvg} width={15} height={15} />
                        : <Image className={styles.icon} alt="lock" src={lockSvg} width={15} height={15} />}
                    </button>
                </>}
            </h2>
            <div className={styles.grid}>
                <span className={styles.state}>
                    {error ? error : <>
                        {data.diffArr.length > 0 && <>
                            <h4 style={{color: 'darkred'}}><b>Detected changes from snapshot:</b></h4>
                            {data.diffArr.map(({ name, rank, oldState, newState }, i) => {
                                return (<p key={i}>
                                    {i + 1}) {rank} {name} [{oldState} → {newState}]
                                </p>);
                            })}
                            <hr />
                            <br />
                        </>}
                        <>{setInfoFromData(false)}</>
                    </>}
                </span>
            </div>
        </div>
    );
}
