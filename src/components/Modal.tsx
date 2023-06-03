import React from "react";
import ReactDOM from "react-dom";
import styles from "../styles/Modal.module.css"

export default function Modal({ onClose, children, title }) {
    const handleCloseClick = (e) => {
        e.preventDefault();
        onClose();
    };

    const modalContent = (
        <div className={styles.modalOverlay}>
            <div className={styles.modalWrapper}>
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        {title && <h2>{title}</h2>}
                        <button type="button" style={{ paddingRight: '1rem', backgroundColor: 'transparent', border: 0, fontSize: '1.5rem' }} onClick={handleCloseClick}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className={styles.modalBody}>{children}</div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        modalContent,
        document.getElementById("mainRoot") as any
    );
};