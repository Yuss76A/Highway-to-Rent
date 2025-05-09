import React, { useState, useEffect } from 'react';
import styles from "../styles/EditBookingModal.module.css";

const EditBookingModal = ({ booking, onClose, onSave, error }) => {
  const initialStartDate = booking.start_date ? booking.start_date.split('T')[0] : '';
  const initialEndDate = booking.end_date ? booking.end_date.split('T')[0] : '';

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [localError, setLocalError] = useState(null);
  const [isAutoClosing, setIsAutoClosing] = useState(false);

  // Clear errors when dates change
  useEffect(() => {
    setLocalError(null);
  }, [startDate, endDate]);

  // Handle auto-close for booking conflicts
  useEffect(() => {
    if (error && error.toLowerCase().includes("already booked")) {
      setIsAutoClosing(true);
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
    setIsAutoClosing(false);
  }, [error, onClose]);

  const handleSave = () => {
    // Frontend validation
    if (!startDate || !endDate) {
      setLocalError('Please select both dates');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setLocalError('End date must be after start date');
      return;
    }
    onSave(booking.id, startDate, endDate);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <h3>Edit Booking Dates</h3>
        
        {/* Error display */}
        {(error || localError) && (
          <div className={styles.errorMessage}>
            ⚠️ {error || localError}
            {isAutoClosing && " (Closing automatically...)"}
          </div>
        )}

        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className={styles.dateInput}
        />

        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate || new Date().toISOString().split('T')[0]}
          className={styles.dateInput}
        />

        <div className={styles.modalButtons}>
          <button 
            className={styles.cancelButton} 
            onClick={onClose}
            disabled={isAutoClosing}
          >
            Cancel
          </button>
          <button 
            className={styles.saveButton} 
            onClick={handleSave}
            disabled={isAutoClosing}
          >
            {isAutoClosing ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;