import React from 'react';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { promptPassword } from '../constants';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  return (
    <div className={styles.grid}>
      <Link className={styles.card} href={'firstParade'}>
        <h2>First Parade &rarr;</h2>
        <p>Click here to get first parade state</p>
      </Link>

      <Link className={styles.card} href={'lastParade'}>
        <h2>Last Parade &rarr;</h2>
        <p>Click here to get last parade state</p>
      </Link>

      <Link href='' className={styles.card} onClick={() => promptPassword(() => router.push(`contacts?password=${process.env.ADMIN_PASSWORD}`))}>
        <h2>Contacts (Admin) &rarr;</h2>
        <p>Click here to display list of contacts</p>
      </Link>

      <Link href='' className={styles.card} onClick={() => promptPassword(() => router.push(`setNewWeek?password=${process.env.ADMIN_PASSWORD}`))}>
        <h2>Set new week (Admin) &rarr;</h2>
        <p>Click here to clear current parade state and set new week</p>
      </Link>
    </div>
  )
}
