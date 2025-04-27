import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/BookedDates.module.css";
import { UserContext } from "../contexts/UserContext";
import ConfirmationModal from '../pages/ConfirmationModal';

const OccupiedDatesDisplay = () => {
  const [bookings, setBookings] = useState([]);
  const [carDetails, setCarDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const { user } = useContext(UserContext);
  const baseURL = 'https://carbookingbackend-df57468af270.herokuapp.com';

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const bookingsResponse = await fetch(`${baseURL}/carbooking/booked-dates/`, {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        });

        if (!bookingsResponse.ok) throw new Error('Failed to fetch bookings');
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);

        const carUrls = [...new Set(bookingsData.map(booking => booking.car))];
        const carsData = {};
        
        await Promise.all(
          carUrls.map(async (url) => {
            const response = await fetch(url, {
              headers: {
                Authorization: `Token ${user.token}`,
              },
            });
            if (response.ok) {
              const data = await response.json();
              carsData[url] = data;
            }
          })
        );
        
        setCarDetails(carsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleCancelClick = (bookingId, carName) => {
    setBookingToCancel({ id: bookingId, name: carName });
    setShowModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    
    try {
      const response = await fetch(`${baseURL}/carbooking/booked-dates/${bookingToCancel.id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${user.token}`,
        },
      });

      if (!response.ok) throw new Error('Cancellation failed');
      setBookings(prev => prev.filter(booking => booking.id !== bookingToCancel.id));
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setShowModal(false);
    }
  };

  if (!user) return <div className={styles.message}>Please log in to view your bookings</div>;
  if (loading) return <div className={styles.message}>Loading your bookings...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  const groupedBookings = bookings.reduce((acc, booking) => {
    const startDate = new Date(booking.start_date);
    const monthYear = startDate.toLocaleString('en', { month: 'long', year: 'numeric' });
    if (!acc[monthYear]) acc[monthYear] = [];
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
              {groupedBookings[monthYear].map((booking) => {
                const car = carDetails[booking.car];
                return (
                  <div key={booking.id} className={styles.bookingCard}>
                    <div className={styles.bookingInfo}>
                      <h3>{car?.name || 'Car Booking'}</h3>
                      {car?.images?.[0]?.image && (
                        <img 
                          src={car.images[0].image} 
                          alt={car.name} 
                          className={styles.carImage} 
                        />
                      )}
                      <p>Reservation #: {booking.reservation_number}</p>
                      <p>Start Date: {new Date(booking.start_date).toLocaleDateString()}</p>
                      <p>End Date: {new Date(booking.end_date).toLocaleDateString()}</p>
                      <p className={styles.reminderText}>
                        Please bring the reservation number when picking up the car.
                      </p>
                    </div>
                    <button
                      onClick={() => handleCancelClick(booking.id, car?.name)}
                      className={styles.cancelButton}
                    >
                      Cancel Booking
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmCancel}
        title="Confirm Cancellation"
        message={`Are you sure you want to cancel booking #${bookingToCancel?.id} for ${bookingToCancel?.name || 'this car'}?`}
      />
    </div>
  );
};

export default OccupiedDatesDisplay;
