import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/BookedDates.module.css";
import { UserContext } from "../contexts/UserContext";

const OccupiedDatesDisplay = () => {
  const [groupedDates, setGroupedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const baseURL = "https://carbookingbackend-df57468af270.herokuapp.com";

  useEffect(() => {
    if (!user) return;

    const fetchBookedDates = async () => {
      try {
        const response = await fetch(`${baseURL}/carbooking/booked-dates/`, {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();
        processDates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const processDates = (bookings) => {
      const grouped = {};
      
      bookings.forEach(booking => {
        const startDate = new Date(booking.start_date);
        const endDate = new Date(booking.end_date);
        const monthYear = startDate.toLocaleString("en", { 
          month: "long", 
          year: "numeric" 
        });

        if (!grouped[monthYear]) grouped[monthYear] = [];
        
        grouped[monthYear].push({
          id: booking.id,
          carId: booking.car,
          startDate: booking.start_date,
          endDate: booking.end_date,
          carDetails: booking.car_details // Assuming your API returns this
        });
      });

      setGroupedDates(grouped);
    };

    fetchBookedDates();
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const response = await fetch(`${baseURL}/carbooking/booked-dates/${bookingId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${user.token}`,
        },
      });

      if (!response.ok) throw new Error("Cancellation failed");
      
      // Refresh the bookings list
      setGroupedDates(prev => {
        const updated = {...prev};
        Object.keys(updated).forEach(month => {
          updated[month] = updated[month].filter(b => b.id !== bookingId);
        });
        return updated;
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) return <div className={styles.message}>Please login to view your bookings</div>;
  if (loading) return <div className={styles.message}>Loading your bookings...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Your Bookings</h1>
      
      {Object.keys(groupedDates).length === 0 ? (
        <div className={styles.message}>You have no active bookings</div>
      ) : (
        Object.keys(groupedDates).map(month => (
          <div key={month} className={styles.monthGroup}>
            <h2 className={styles.monthHeader}>{month}</h2>
            <div className={styles.bookingsList}>
              {groupedDates[month].map(booking => (
                <div key={booking.id} className={styles.bookingCard}>
                  <div className={styles.bookingInfo}>
                    <h3>{booking.carDetails?.name || "Car Booking"}</h3>
                    <p>
                      {new Date(booking.startDate).toLocaleDateString()} -{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleCancelBooking(booking.id)}
                    className={styles.cancelButton}
                  >
                    Cancel Booking
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OccupiedDatesDisplay;