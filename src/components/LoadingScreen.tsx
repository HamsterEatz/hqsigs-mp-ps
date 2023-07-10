import styles from '../styles/LoadingScreen.module.css';

export default function LoadingScreen(props: { title?: string }) {
    const { title } = props;
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.grid}>
                    {title ? <h2>{title}</h2> : <></>}
                    <div className={styles.loadingScreen} />
                </div>
            </div>
        </div>
    )
}