import React, { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext"; 
import styles from "../../styles/AuthForm.module.css";

function SignInForm() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://carbookingbackend-df57468af270.herokuapp.com/carbooking/login/",
        {
          email: formData.email,
          password: formData.password
        }
      );

      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);

      if (location.state?.bookingIntent) {
        const pendingBooking = JSON.parse(sessionStorage.getItem('pendingBooking'));
        sessionStorage.removeItem('pendingBooking');
        
        navigate(`/booking?carId=${pendingBooking.carId}`, {
          state: { 
            preselectedDates: {
              startDate: new Date(pendingBooking.startDate),
              endDate: new Date(pendingBooking.endDate)
            },
            welcome_message: response.data.welcome_message
          }
        });
      } else {
        navigate(location.state?.from || "/", {
          state: {
            welcome_message: response.data.welcome_message
          }
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
                         "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.authFormContainer}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2>Sign In</h2>
        
        {location.state?.message && (
          <div className={styles.infoMessage}>
            {location.state.message}
          </div>
        )}
        
        {location.state?.bookingIntent && (
          <div className={styles.bookingNotice}>
            Please sign in to complete your booking
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="username"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner}></span>
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className={styles.authFooter}>
        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
}

export default SignInForm;
