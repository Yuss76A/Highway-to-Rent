import React, { useState } from 'react';
import styles from "../styles/EditBookingModal.module.css";

const EditBookingModal = ({ booking, onClose, onSave }) => {
  // Extract initial dates in YYYY-MM-DD format
  const initialStartDate = booking.start_date ? booking.start_date.split('T')[0] : '';
  const initialEndDate = booking.end_date ? booking.end_date.split('T')[0] : '';

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const handleSave = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }
    if (startDate > endDate) {
      alert('Start date cannot be after end date.');
      return;
    }
    onSave(booking.id, startDate, endDate);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <h3>Edit Booking Dates</h3>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={styles.dateInput}
        />
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={styles.dateInput}
        />

        <div className={styles.modalButtons}>
          <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
          <button className={styles.saveButton} onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;