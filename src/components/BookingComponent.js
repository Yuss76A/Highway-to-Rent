import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import CarCard from "./cardetails/CarCard";
import styles from "../styles/BookingComponent.module.css"

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
  const [loggedInUser, setLoggedInUser] = useState(currentUser);

  const [carData, setCarData] = useState([]);

  useEffect(() => {
    async function fetchCarData() {
      try {
        const response = await fetch(
          "https://your-api-endpoint.com/cars/", // Update the URL to fetch car data
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch car data.");
        }

        const data = await response.json(); // Parse the JSON response

        console.log("Fetching successful:", data);
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

    if (!selectedDates.startDate || selectedDates.endDate) {
      // If no dates are selected or both are already set, reset to a single date
      setSelectedDates({ startDate: selectedDate, endDate: null });
    } else if (selectedDate.getTime() === selectedDates.startDate.getTime()) {
      // If clicking the same date again, treat as a single-day selection
      setSelectedDates({ startDate: selectedDate, endDate: selectedDate });
    } else {
      // Set the endDate if selecting a valid range
      if (selectedDate > selectedDates.startDate) {
        setSelectedDates({ ...selectedDates, endDate: selectedDate });
      } else {
        setSelectedDates({
          startDate: selectedDate,
          endDate: selectedDates.startDate,
        });
      }
    }

    setError(""); // Clear any error message on date selection
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

    // Add previous month days
    for (let i = startOfMonth - 1; i >= 0; i--) {
      days.push({ day: daysInPreviousMonth - i, monthOffset: -1 });
    }

    // Add current month days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push({ day: i, monthOffset: 0 });
    }

    // Add next month days
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

    return (   (selectedDates.startDate &&
        selectedDates.startDate.getTime() === date.getTime()) ||
      // Check if endDate != null && is the tile, the endDate?
      (selectedDates.endDate &&
        selectedDates.endDate.getTime() === date.getTime()) ||
      // Check if startDate && endDate != null && is the tile between the two?
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

    // If endDate is null, fall back to startDate for single-day booking
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

    const availableCars = carData.filter((car) =>
      car.occupiedDates.every((occ) => !isDateInRange(occ.date))
    );

    setFilteredCars(availableCars);
    setIsFiltered(true);
    setError("");
  };
  return (
    <div className={styles.bookingContainer}>
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
  
      <div className={styles.filteredCars}>
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <CarCard
              onBookingSuccess={() => {
                setSelectedDates({ startDate: null, endDate: null });
                setFilteredCars([]);
                setSuccess("Booking Successful!");
                setTimeout(() => {
                  setSuccess("");
                  setError("");
                }, 5000);
              }}
              key={car.id}
              car={car}
              selectedDateRange={selectedDates}
            />
          ))
        ) : isFiltered && selectedDates.startDate ? (
          <p>No available cars for the selected dates.</p>
        ) : success !== "" ? (
          <p>{success}</p>
        ) : error !== "" ? (
          <p>{error}</p>
        ) : (
          <p>Please select a date for booking.</p>
        )}
      </div>
    </div>
  );
};
export default BookingComponent;