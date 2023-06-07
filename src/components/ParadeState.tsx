import styles from '../styles/ParadeState.module.css';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import Image from 'next/image';
import whatsappSvg from '../public/whatsapp.svg';
import phoneSvg from '../public/phone.svg';
import { useRouter } from 'next/router';
import { promptPassword } from '../constants';

export default function ParadeState({ isFirstParade, data, error }) {
    const [showModal, setShowModal] = useState(false);
    const [info, setInfo] = useState('');

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
        }
    }, [data]);

    async function setInfoFromData(data: { present, absent, unaccounted }) {
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
    const router = useRouter();
    function onLockButtonClick() {
        return promptPassword(() => router.push(`../lockStatus/toggle?password=${process.env.ADMIN_PASSWORD}`))
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
                <button onClick={copyParadeState} className={styles.copyButton} type="button">Copy
                    <span id="copyToClipboardTooltip" className={styles.copyButtonTooltip}>Copied!</span>
                </button>}
                {isFirstParade && !data.isLocked && <button className={styles.lockButton} onClick={onLockButtonClick}>Lock</button>}
            </h2>
            <div className={styles.grid}>
                <span className={styles.state}>
                    {error ? error : info}
                </span>
            </div>
        </div>
    );
}
