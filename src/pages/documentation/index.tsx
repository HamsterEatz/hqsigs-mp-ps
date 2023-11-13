import { useEffect, useState } from 'react';
import styles from '../../styles/Documentation.module.css';
import Image from 'next/image';
import QRCode from 'qrcode';
import { useRouter } from 'next/router';

export default function Documentation() {
    const [url, setUrl] = useState('');
    
    const router = useRouter();
    useEffect(() => {
        QRCode.toDataURL(location.origin + router.asPath).then(url => setUrl(url));
    }, []);

    return (
        <div className={styles.container}>
            <h2>Documentation:</h2>
            <div className={styles.grid}>
                <iframe className={styles.state} src={`https://docs.google.com/document/d/e/${process.env.GOOGLE_DOCS_EMBED_ID}/pub?embedded=true`} />
            </div>
            <br />
            <div className={styles.grid}>
                <div style={{ textAlign: 'center' }}>
                    <h3>Scan the QR Code below to direct to this webpage!</h3>
                    <Image src={url} alt={'qrcode'} width={200} height={200} />
                </div>
            </div>
        </div>
    );
}
