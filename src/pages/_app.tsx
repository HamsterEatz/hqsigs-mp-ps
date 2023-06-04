import React from 'react';
import '../styles/globals.css';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Singapore');

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <Head>
          <title>HQSIGS MP Parade State</title>
          <meta name="description" content="Parade State" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <h1>HQ Signals Manpower Branch Parade State</h1>
      </header>

      <main id='mainRoot' className={styles.main}>
        <Component {...pageProps} />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerItems}>
          <a className={styles.github} href="https://github.com/HamsterEatz/hqsigs-mp-ps" target="_blank" rel="noreferrer">
            <Image alt="github" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width={32} height={32} />
            <span style={{ paddingLeft: 10 }}>https://github.com/HamsterEatz/hqsigs-mp-ps</span>
          </a>
          <p style={{ paddingLeft: '10%' }}>A open source project created by Nelson</p>
          <p style={{ paddingLeft: '10%' }}>MP-PS v1.0.0</p>
        </div>
      </footer>
    </div>
  )
}

export default MyApp;
