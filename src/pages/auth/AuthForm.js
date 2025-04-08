import React, { useContext, useEffect, useState } from "react";
import styles from "../../styles/AuthForm.module.css";
import { UserContext } from "../../contexts/UserContext"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create a single AuthForm component that switches between sign-in and sign-up
const AuthForm = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "", // For registration
  });

  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage(""); // Clear any error messages on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin 
    ? "https://carbookingbackend-df57468af270.herokuapp.com/carbooking/login/" : 
    "https://carbookingbackend-df57468af270.herokuapp.com/carbooking/register/";

    try {
      const response = await axios.post(endpoint, {
          email: formData.email,
          password: formData.password,
          username: formData.email, // Assuming username is the email
          full_name: formData.name, // Only for registration
      });

      const data = response.data;
      localStorage.setItem("user", JSON.stringify(data)); 
      setUser(data);
      navigate("/");
  } catch (err) {
      console.error("Error during registration/login:", err); // Log the error object
      console.error("Response data:", err.response?.data); // Log detailed response data
      setErrorMessage(err.response?.data?.email?.[0] || "An error occurred."); // Get specific email-related error
  }
};

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
    setFormData({ email: "", password: "", name: "" }); // Reset form data
    setErrorMessage(""); // Clear error messages when toggling
  };

  return (
    <div className={styles.authFormContainer}>
      <form className={styles.authForm} onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login to Your Account" : "Create an Account"}</h2>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>} {/* Display error message */}
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            className={styles.inputField}
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name" // Added autocomplete attribute
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={styles.inputField}
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email" // Added autocomplete attribute
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className={styles.inputField}
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password" // Specify for new password during registration
        />
        <button type="submit">{isLogin ? "Log In" : "Sign Up"}</button>
      </form>
      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button className={styles.switcher} onClick={toggleAuthMode}>
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;