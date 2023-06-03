import styles from '../styles/ParadeState.module.css';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Modal from './Modal';

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
        }
    }
    useEffect(() => {
        if (data) {
            setInfoFromData(data);
        }
    }, [data]);

    function setInfoFromData(data: { present, absent, unaccounted }) {
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
                info += `\n${i + 1}) ${unaccounted[i].rank} ${unaccounted[i].name}`;
            }
        }

        setInfo(info);
    }
    return (
        <div className={styles.container}>
            <div>
                {false && // TODO: Add contacts to unaccounted
                    <Modal title={<b style={{ color: '#dc3545' }}>Unaccounted Detected!</b>} onClose={() => setShowModal(false)}>
                        Hello from the modal!
                    </Modal>
                }
            </div>
            <h2>{isFirstParade ? 'First' : 'Last'} Parade State: {!error && <button onClick={copyParadeState} className={styles.copyButton} type="button">Copy<span id="copyToClipboardTooltip" className={styles.copyButtonTooltip}>Copied!</span></button>}</h2>
            <div className={styles.grid}>
                <span className={styles.state}>
                    {error ? error : info}
                </span>
            </div>
        </div>
    );
}
