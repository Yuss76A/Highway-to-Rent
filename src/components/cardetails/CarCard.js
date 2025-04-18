import React, { useContext, useState } from "react";
import CarImageSlider from "./CarImageSlider";
import CarInfo from "./CarInfo";
import styles from "../../styles/CarDetail.module.css";
import { UserContext } from "../../contexts/UserContext"; 
import { useNavigate } from "react-router-dom";

const CarCard = ({ car, selectedDateRange, onBookingSuccess }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleBooking = async () => {
    if (!user) {
      setError('You must be logged in to book a car.');
      return navigate('/auth');
    }

    console.log('USER Object:', user);
    console.log('USER ID: ', user.user ? user.user.id : "User ID is not available");

    if (!user.user || !user.user.id) {  // Correct check for user ID
      console.error('User ID is undefined. Unable to proceed with booking.');
      setError('User data is not available. Please log in again.');
      return;
    }
  
    if (!selectedDateRange?.startDate) {
      setError('Please select a date range.');
      return;
    }
      
    setError(null);
    const baseURL = "https://carbookingbackend-df57468af270.herokuapp.com";
    console.log('USER URL: ', `${baseURL}/carbooking/users/${user.user.id}/`); // Correct URL construction

    try {
      const bookingRequestBody = {
        car: `${baseURL}/carbooking/cars/${car.id}/`,
        user: `${baseURL}/carbooking/users/${user.user.id}/`, // Correct user reference
        date: selectedDateRange.startDate.toISOString().split('T')[0],
      };
  
      console.log('Booking Request Body:', JSON.stringify(bookingRequestBody, null, 2));
  
      const response = await fetch(`${baseURL}/carbooking/booked-dates/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${user.token}`, // Ensure user.token is accessible
        },
        body: JSON.stringify(bookingRequestBody),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || errorData.message || "Booking failed.";
        setError(errorMessage);
        return;
      }
  
      onBookingSuccess();
    } catch (error) {
      console.error("Booking error:", error);
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
          disabled={!selectedDateRange.startDate}
        >
          Book Car
        </button>
      )}
    </div>
  );
};

export default CarCard;
