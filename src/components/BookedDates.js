import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/BookedDates.module.css";
import { UserContext } from "../contexts/UserContext";

const OccupiedDatesDisplay = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const baseURL = 'https://carbookingbackend-df57468af270.herokuapp.com';

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch booked dates for the logged-in user
    const fetchBookedDates = async () => {
      try {
        const response = await fetch(`${baseURL}/carbooking/booked-dates/`, {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch bookings');
        
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedDates();
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await fetch(`${baseURL}/carbooking/booked-dates/${bookingId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${user.token}`,
        },
      });

      if (!response.ok) throw new Error('Cancellation failed');
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) return <div className={styles.message}>Please log in to view your bookings</div>;
  if (loading) return <div className={styles.message}>Loading your bookings...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  // Grouping bookings by month
  const groupedBookings = bookings.reduce((acc, booking) => {
    const date = new Date(booking.date);
    const monthYear = date.toLocaleString('en', { month: 'long', year: 'numeric' });

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }

    acc[monthYear].push(booking);
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Your Bookings</h1>
      {Object.keys(groupedBookings).length === 0 ? (
        <div className={styles.message}>You have no active bookings</div>
      ) : (
        Object.keys(groupedBookings).map(monthYear => (
          <div key={monthYear} className={styles.monthGroup}>
            <h2 className={styles.monthHeader}>{monthYear}</h2>
            <div className={styles.bookingsList}>
              {groupedBookings[monthYear].map((booking) => (
                <div key={booking.id} className={styles.bookingCard}>
                  <div className={styles.bookingInfo}>
                    <h3>{booking.car_details?.name || 'Car Booking'}</h3>
                    <p>{new Date(booking.date).toLocaleDateString()}</p>
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