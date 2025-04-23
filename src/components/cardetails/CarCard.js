import React, { useContext, useState } from "react";
import CarImageSlider from "./CarImageSlider";
import CarInfo from "./CarInfo";
import styles from "../../styles/CarDetail.module.css";
import { UserContext } from "../../contexts/UserContext"; 
import { useNavigate, useLocation } from "react-router-dom";

const CarCard = ({ car, selectedDateRange, onBookingSuccess }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  const handleBooking = async () => {
    if (!user) {
      // Save the booking details in session storage
      sessionStorage.setItem('pendingBooking', JSON.stringify({
        carId: car.id,
        startDate: selectedDateRange.startDate,
        endDate: selectedDateRange.endDate
      }));
      
      // Redirect to sign in with return path
      navigate('/signin', {
        state: { 
          from: location.pathname,
          bookingIntent: true
        }
      });
      return;
    }

    if (!user.user || !user.user.id) {
      setError('User data is not available. Please log in again.');
      return;
    }
  
    if (!selectedDateRange?.startDate || !selectedDateRange?.endDate) {
      setError('Please select a start and end date.');
      return;
    }
      
    setError(null);
    
    const start_date = selectedDateRange.startDate.toISOString().split('T')[0];
    const end_date = selectedDateRange.endDate.toISOString().split('T')[0];
    
    const bookingRequestBody = {
      car: `https://carbookingbackend-df57468af270.herokuapp.com/carbooking/cars/${car.id}/`,
      user: `https://carbookingbackend-df57468af270.herokuapp.com/carbooking/users/${user.user.id}/`,
      start_date,
      end_date,
    };
  
    try {
      const response = await fetch(`https://carbookingbackend-df57468af270.herokuapp.com/carbooking/booked-dates/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${user.token}`,
        },
        body: JSON.stringify(bookingRequestBody),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || errorData.message || "Booking failed.");
        return;
      }
  
      onBookingSuccess();
    } catch (error) {
      setError(error.message); 
    }
  };

  return (
    <div className={styles['car-card']}>
      {error && <div className={styles.error}>{error}</div>}
      <CarImageSlider images={car.images} />
      <CarInfo car={car} />
      {selectedDateRange && (
        <button
          className={styles['book-car-button']}
          onClick={handleBooking}
          disabled={!selectedDateRange.startDate || !selectedDateRange.endDate}
        >
          Book Car
        </button>
      )}
    </div>
  );
};

export default CarCard;
