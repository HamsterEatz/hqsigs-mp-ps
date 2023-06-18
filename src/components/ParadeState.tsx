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

export default function ParadeState({ isFirstParade, data, error }) {
    const [showModal, setShowModal] = useState(false);
    const [info, setInfo] = useState('');
    const [isLocked, setIsLocked] = useState(false);

    function copyParadeState(e) {
        e.preventDefault();
        if (data) {
            let copyButton = document.getElementById('copyToClipboardTooltip');
            copyButton!!.style.visibility = 'visible';
            navigator.clipboard.writeText(info);
            window.setTimeout(() => copyButton!!.style.visibility = 'hidden', 2000);
            if (data.unaccounted.length > 0) {
                setShowModal(true);
            }
        }
    }
    useEffect(() => {
        if (data) {
            setInfoFromData(data);
            setIsLocked(data.isLocked);
        }
    }, [data]);

    async function setInfoFromData(data: { diffArr, present, absent, unaccounted }) {
        const { present, absent, unaccounted } = data;
        const now = moment();
        let info = `*${now.format('DD/MM/YY')} ${isFirstParade ? 'First' : 'Last'} Parade - Manpower Br*\n\n*Present*:`;
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

        setInfo(info);
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
                        <>{info}</>
                    </>}
                </span>
            </div>
        </div>
    );
}
