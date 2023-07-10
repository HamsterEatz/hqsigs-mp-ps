import { useEffect, useState } from 'react';
import { fetchDocsApi } from '../../apis';
import styles from '../../styles/Documentation.module.css';
import Image from 'next/image';
import QRCode from 'qrcode';
import { useRouter } from 'next/router';

export async function getServerSideProps({ query }) {
    try {
        return {
            props: {
                data: await fetchDocsApi()
            }
        }
    } catch (e) {
        return {
            props: {
                error: e.message
            }
        }
    }
}

export default function Documentation({ data, error }) {
    const [url, setUrl] = useState('');
    
    const router = useRouter();
    useEffect(() => {
        QRCode.toDataURL(location.origin + router.asPath).then(url => setUrl(url));
    }, []);

    return (
        <div className={styles.container}>
            <h2>Documentation:</h2>
            <div className={styles.grid}>
                <div className={styles.state}>
                    {error ? error : <div dangerouslySetInnerHTML={{ __html: data }} />}
                </div>
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
