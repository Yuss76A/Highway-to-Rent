import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import CarCard from "./cardetails/CarCard";
import styles from "../styles/BookingComponent.module.css";

const BookingComponent = ({ currentUser }) => {
  const [selectedDates, setSelectedDates] = useState({
    startDate: null,
    endDate: null,
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filteredCars, setFilteredCars] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reservationNumber, setReservationNumber] = useState("");
  const [infoVisible, setInfoVisible] = useState(false);
  const [carData, setCarData] = useState([]);

  useEffect(() => {
    async function fetchCarData() {
      try {
        const response = await fetch(
          "https://carbookingbackend-df57468af270.herokuapp.com/carbooking/cars/",
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch car data.");
        }

        const data = await response.json();
        setCarData(data);
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    }
    fetchCarData();
  }, []);

  const handleDateClick = (day, monthOffset = 0) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + monthOffset,
      day
    );

    if (selectedDate < new Date()) {
      setError('You cannot select a past date.');
      return;
    }

    if (!selectedDates.startDate || selectedDates.endDate) {
      setSelectedDates({ startDate: selectedDate, endDate: null });
    } else if (selectedDate.getTime() === selectedDates.startDate.getTime()) {
      setSelectedDates({ startDate: selectedDate, endDate: selectedDate });
    } else {
      if (selectedDate > selectedDates.startDate) {
        setSelectedDates({ ...selectedDates, endDate: selectedDate });
      } else {
        setSelectedDates({
          startDate: selectedDate,
          endDate: selectedDates.startDate,
        });
      }
    }
    setError("");
  };

  const handleMonthChange = (increment) => {
    const newDate = new Date(
      currentDate.setMonth(currentDate.getMonth() + increment)
    );
    setCurrentDate(new Date(newDate));
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const startOfMonth = new Date(year, month, 1).getDay();
    const daysInPreviousMonth = new Date(year, month, 0).getDate();

    const days = [];

    for (let i = startOfMonth - 1; i >= 0; i--) {
      days.push({ day: daysInPreviousMonth - i, monthOffset: -1 });
    }

    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push({ day: i, monthOffset: 0 });
    }

    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({ day: i, monthOffset: 1 });
    }

    return days;
  };

  const isDateSelected = (day, monthOffset) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + monthOffset,
      day
    );

    return (
      (selectedDates.startDate &&
        selectedDates.startDate.getTime() === date.getTime()) ||
      (selectedDates.endDate &&
        selectedDates.endDate.getTime() === date.getTime()) ||
      (selectedDates.startDate &&
        selectedDates.endDate &&
        date >= selectedDates.startDate &&
        date <= selectedDates.endDate)
    );
  };

  const days = generateCalendarDays();

  const handleFilterCars = () => {
    if (!selectedDates.startDate) {
      setError("Please select a valid date.");
      setIsFiltered(false);
      return;
    }
  
    const startDate = selectedDates.startDate;
    const endDate = selectedDates.endDate || selectedDates.startDate;
  
    const isDateInRange = (occupiedDate) => {
      const occupied = new Date(occupiedDate);
      occupied.setHours(0, 0, 0, 0);
  
      let fallsIntoRange = true;
  
      if (endDate.getTime() !== startDate.getTime()) {
        fallsIntoRange = occupied >= startDate && occupied <= endDate;
      } else {
        fallsIntoRange = occupied.getTime() === startDate.getTime();
      }
  
      return fallsIntoRange;
    };
  
    const availableCars = carData.filter((car) => {
      if (!car.occupiedDates || !Array.isArray(car.occupiedDates)) {
        return true;
      }
      return car.occupiedDates.every((occ) => !isDateInRange(occ.date));
    });
  
    setFilteredCars(availableCars);
    setIsFiltered(true);
    setError("");
  };

  return (
    <div className={styles.bookingContainer}>
      <div 
        className={styles.infoToggle} 
        onClick={() => setInfoVisible(!infoVisible)}
        style={{ cursor: 'pointer', marginBottom: '1rem' }}
      >
        <div className={`${styles.light} ${infoVisible ? styles.on : styles.off}`}>
          {infoVisible ? "Hide Info" : "Show Info"}
        </div>
      </div>
  
      {infoVisible && (
        <div className={styles.infoText}>
          <p>Be aware, we don't ask for money in advance for the reservation of the car. The only thing you need to provide when you come is your username and the dates of reservation (start and end). If you want to cancel your booking, you need to contact our offices or send us an email 24 hours before. If you want to cancel your booking via phone, please contact us 1 hour before, via email 24 hours beforehand. If we see that the client doesn't arrive, we will wait 15 minutes, and then the client will be charged an additional fee.</p>
        </div>
      )}
  
      <div className={styles.calendarHeader}>
        <button className={styles.dateSwitcher} onClick={() => handleMonthChange(-1)}>
          <FaArrowLeft />
        </button>
        <h2>{currentDate.toLocaleString("default", { month: "long", year: "numeric" })}</h2>
        <button className={styles.dateSwitcher} onClick={() => handleMonthChange(1)}>
          <FaArrowRight />
        </button>
      </div>
  
      <div className={styles.calendarDays}>
        {days.map(({ day, monthOffset }, index) => (
          <div
            key={index}
            className={`${styles.calendarDay} ${isDateSelected(day, monthOffset) ? styles.selected : ''} ${monthOffset !== 0 ? styles.overflow : ''}`}
            onClick={() => handleDateClick(day, monthOffset)}
          >
            {day}
          </div>
        ))}
      </div>
  
      <button className={styles.bookCarsButton} onClick={handleFilterCars}>
        Book Cars
      </button>
  
      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && (
        <div className={styles.successMessage}>
          {success}
          {reservationNumber && (
            <div className={styles.reservationNumber}>
              Reservation #: {reservationNumber}
            </div>
          )}
        </div>
      )}
  
      <div className={styles.filteredCars}>
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <CarCard
              onBookingSuccess={(resNumber) => {
                setSelectedDates({ startDate: null, endDate: null });
                setFilteredCars([]);
                setSuccess("Booking Successful!");
                setReservationNumber(resNumber);
                setTimeout(() => {
                  setSuccess("");
                  setError("");
                  setReservationNumber("");
                }, 5000);
              }}
              key={car.id}
              car={car}
              selectedDateRange={selectedDates}
              currentUser={currentUser}
            />
          ))
        ) : isFiltered && selectedDates.startDate ? (
          <p>No available cars for the selected dates.</p>
        ) : (
          <p>Please select a date for booking.</p>
        )}
      </div>
    </div>
  );
};

export default BookingComponent;
