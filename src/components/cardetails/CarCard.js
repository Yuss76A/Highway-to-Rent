import React, { useContext, useState } from "react";
import CarImageSlider from "./CarImageSlider";
import CarInfo from "./CarInfo";
import styles from "../../styles/CarDetail.module.css";
import { UserContext } from "../../contexts/UserContext"; 
import { useNavigate, useLocation } from "react-router-dom";

const CarCard = ({ car, selectedDateRange, onBookingSuccess, currentUser }) => {
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
    
    try {
      const response = await fetch(
        "https://carbookingbackend-df57468af270.herokuapp.com/carbooking/booked-dates/", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${user.token}`,
          },
          body: JSON.stringify({
            car: `https://carbookingbackend-df57468af270.herokuapp.com/carbooking/cars/${car.id}/`,
            start_date,
            end_date,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        
        // Specific handling for "already booked" error
        if (errorData.non_field_errors && 
            errorData.non_field_errors.some(msg => msg.includes("already booked"))) {
          setError("This car is already booked for the selected dates.");
        } 
        
        else if (errorData.detail) {
          setError(errorData.detail);
        } else {
          setError("Booking failed. Please try again.");
        }
        return;
      }

      const data = await response.json();
      onBookingSuccess(data.reservation_number);
    } catch (error) {
      setError("An error occurred while processing your booking. Please try again.");
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