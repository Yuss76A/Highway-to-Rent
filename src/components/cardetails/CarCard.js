import React, { useContext, useState } from "react";
import CarImageSlider from "./CarImageSlider";
import CarInfo from "./CarInfo";
import styles from "../../styles/CarDetail.module.css";
import { UserContext } from "../../contexts/UserContext"; 
import { useNavigate } from "react-router-dom";

const CarCard = ({ car, selectedDateRange, onBookingSuccess }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null); // Proper state initialization

  const handleBooking = async (carId, userId, selectedDateRange) => {
    if (!user) {
      return navigate("/auth");
    }
    
    try {
      const baseURL = "https://carbookingbackend-df57468af270.herokuapp.com";
      const bookingEndpoint = `${baseURL}/carbooking/booked-dates/`;
    
      const carUrl = `${baseURL}/carbooking/cars/${carId}/`;
      const userUrl = `${baseURL}/carbooking/users/${userId}/`;
    
      const startDate = selectedDateRange.startDate.toISOString().slice(0, 10);
      const endDate = selectedDateRange.endDate 
        ? selectedDateRange.endDate.toISOString().slice(0, 10)
        : startDate;
    
      const response = await fetch(bookingEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${user.token}`,
        },
        body: JSON.stringify({
          car: carUrl,
          user: userUrl,
          start_date: startDate,
          end_date: endDate,
        }),
      });
    
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || "Booking failed";
        setError(errorMessage); // Set error state
        throw new Error(errorMessage);
      }
    
      const data = await response.json();
      setError(null); // Clear any previous errors
      onBookingSuccess();
      return data;
    } catch (error) {
      console.error("Booking error:", error);
      setError(error.message);
      throw error;
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
          onClick={() => handleBooking(car.id, user?.id, selectedDateRange)}
          disabled={!selectedDateRange.startDate}
        >
          Book Car
        </button>
      )}
    </div>
  );
};

export default CarCard;