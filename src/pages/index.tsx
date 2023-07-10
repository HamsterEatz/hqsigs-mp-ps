import { useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  async function onSetNewWeekOnClick() {
    const password = prompt('Enter admin password');
    if (password === null) {
      return;
    }
    setIsLoading(true);
    const res = await fetch(location.origin + '/api/paradeState/setNewWeek', {
      method: 'POST',
      body: JSON.stringify({ password })
    });
    setIsLoading(false);
    if (!res.ok) {
      alert((await res.json()).message);
    }
  }

  return (
    <div className={styles.grid}>
      {isLoading && <LoadingScreen title='Setting new week for parade state...' />}

      <Link className={styles.card} href={'firstParade'}>
        <h2>First Parade &rarr;</h2>
        <p>Click here to get first parade state!</p>
      </Link>

      <Link className={styles.card} href={'lastParade'}>
        <h2>Last Parade &rarr;</h2>
        <p>Click here to get last parade state!</p>
      </Link>

      <Link className={styles.card} href={'calendar'}>
        <h2>Calendar &rarr;</h2>
        <p>Click here to view calendar events!</p>
      </Link>

      <Link className={styles.card} href={'documentation'}>
        <h2>Documentation &rarr;</h2>
        <p>Click here to view documentations!</p>
      </Link>

      <Link href={'users'} className={styles.card}>
        <h2>Users Panel (Admin) &rarr;</h2>
        <p>Click here to contact, remove or add users!</p>
      </Link>

      <div className={styles.card} onClick={onSetNewWeekOnClick} style={{ cursor: 'pointer' }}>
        <h2>Set new week (Admin) &rarr;</h2>
        <p>Click here to clear current parade state and set new week!</p>
      </div>
    </div>
  )
}