import React from 'react';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
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

      <Link className={styles.card} href={'remarks'}>
        <h2>Remarks &rarr;</h2>
        <p>Click here to display users with remarks</p>
      </Link>

      <Link className={styles.card} href={'contacts'}>
        <h2>Contacts &rarr;</h2>
        <p>Click here to display list of contacts</p>
      </Link>
    </div>
  )
}
