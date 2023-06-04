import { contactsApi } from '../../apis';
import styles from '../../styles/ParadeState.module.css';
import Image from 'next/image';
import whatsappSvg from '../../public/whatsapp.svg';
import phoneSvg from '../../public/phone.svg';

export async function getServerSideProps({ query }) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    let error = 'Access denied';

    if (query.password === adminPassword) {
        try {
            const data = await contactsApi();
            return {
                props: {
                    data
                }
            }
        } catch (e) {
            error = e.message;
        }
    }

    return {
        props: {
            error
        }
    }
}

export default function Contacts({ data, error }) {
    return (
        <div className={styles.container}>
            <h2>Contacts:</h2>
            <div className={styles.grid}>
                <span className={styles.state}>
                    {error ? error : data.map(({ rank, name, contact }, i) => {
                        return (
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
                        );
                    })}
                </span>
            </div>
        </div>
    );
}
