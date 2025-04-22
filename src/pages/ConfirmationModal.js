import React from 'react';
import styles from '../styles/ConfirmationModal.module.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    return (
        isOpen && (
            <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                    <h2>Confirm Action</h2>
                    <p>{message}</p>
                    <div className={styles.buttonGroup}>
                        <button onClick={onConfirm} className={styles.confirmButton}>Yes</button>
                        <button onClick={onClose} className={styles.cancelButton}>No</button>
                    </div>
                </div>
            </div>
        )
    );
};

export default ConfirmationModal;