import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { ENV } from '../constants';
import { useRouter } from 'next/router';
import QRCode from 'qrcode';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  async function onSetNewWeekOnClick() {
    const password = prompt('Enter admin password');
    if (password === null) {
      return;
    }
    const data = await fetch(location.origin + '/api/setNewWeek', {
      method: 'POST',
      body: JSON.stringify({ password })
    });
    alert((await data.json()).message);
  }

  function onUsersPanelOnClick() {
    const passwordInput = prompt('Enter admin password');
    if (passwordInput === null) {
      return;
    }
    if (passwordInput === ENV.ADMIN_PASSWORD) {
      return router.push({ pathname: 'users', query: { password: ENV.ADMIN_PASSWORD } });
    }
    return alert('Access denied!');
  }

  const [url, setUrl] = useState('');
  useEffect(() => {
    QRCode.toDataURL(location.origin).then(url => setUrl(url));
  }, []);

  return (
    <>
      <div className={styles.grid}>
        <Link className={styles.card} href={'firstParade'}>
          <h2>First Parade &rarr;</h2>
          <p>Click here to get first parade state!</p>
        </Link>

        <Link className={styles.card} href={'lastParade'}>
          <h2>Last Parade &rarr;</h2>
          <p>Click here to get last parade state!</p>
        </Link>

        <Link href='' className={styles.card} onClick={onUsersPanelOnClick}>
          <h2>Users Panel (Admin) &rarr;</h2>
          <p>Click here to contact, remove or add users!</p>
        </Link>

        <div className={styles.card} onClick={onSetNewWeekOnClick}>
          <h2>Set new week (Admin) &rarr;</h2>
          <p>Click here to clear current parade state and set new week!</p>
        </div>
      </div>
      <br />
      <div className={styles.grid}>
        <div style={{ textAlign: 'center' }}>
          <h3>Scan the QR Code below to direct to this webpage!</h3>
          <Image src={url} alt={'qrcode'} width={200} height={200} />
        </div>
      </div>
  </>
  )
}