import React, { useContext } from "react";
import CarImageSlider from "./CarImageSlider";
import CarInfo from "./CarInfo";

import styles from "../../styles/CarDetail.module.css";
import { UserContext } from "../../contexts/UserContext"; 
import { useNavigate } from "react-router-dom";

const CarCard = ({ car, selectedDateRange, onBookingSuccess }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleBooking = async (carId, userId, selectedDateRange) => {
    if (!user) {
      return navigate("/auth");
    }

    const baseURL = "https://carbookingbackend-df57468af270.herokuapp.com";
    const carUrl = `${baseURL}/cars/${carId}/`;
    const userUrl = `${baseURL}/users/${userId}/`;

    if (selectedDateRange.startDate && !selectedDateRange.endDate) {
      selectedDateRange.endDate = selectedDateRange.startDate;
    }
    for (
      let currentDate = new Date(selectedDateRange.startDate);
      currentDate <= new Date(selectedDateRange.endDate);
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      try {
        const response = await fetch(`${baseURL}/occupied-dates/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${user.token}`,
          },
          body: JSON.stringify({
            car: carUrl,
            user: userUrl,
            date: currentDate
              .toISOString()
              .slice(0, 10),
          }),
        });

        if (!response.ok) {
          throw new Error("Booking failed");
        }
        
        const data = await response.json();
        onBookingSuccess();
        console.log("Booking successful:", data);
      } catch (error) {
        console.error("Error during booking:", error);
      }
    }
  };

  return (
    <div className="{styles['car-card']}">
      <CarImageSlider images={car.images} />
      <CarInfo car={car} />
      {selectedDateRange ? (
        <button
          className={styles['book-car-button']}
          onClick={() =>
            handleBooking(car.id, user.user.id, selectedDateRange)
          }
          disabled={!selectedDateRange.startDate}
        >
          Book Car
        </button>
      ) : null}
    </div>
  );
};

export default CarCard;