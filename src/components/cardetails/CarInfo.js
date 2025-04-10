import React from "react";
import styles from "../../styles/CarInfo.module.css";

const CarInfo = ({ car }) => {
  return (
    <div className={styles.carInfo}>
      <h2 style={{ marginBottom: '0.5rem' }}>{car?.name || 'Car Model Not Specified'}</h2>
      
      <div style={{ marginBottom: '0.8rem' }}>
        <strong>Price per Day:</strong> 
        {' '}{(car?.price_per_day ?? 0).toFixed(2)} {car?.currency || 'EUR'}
      </div>
      
      <div style={{ marginBottom: '1.2rem' }}>
        <strong>Max Passengers:</strong> 
        {' '}{car?.max_capacity ?? 'N/A'}
      </div>
      
      <p className={styles.description}>
        {car?.description || 'No description available'}
      </p>
    </div>
  );
};

export default CarInfo;