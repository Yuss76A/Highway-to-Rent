import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext"; 
import styles from "../../styles/AuthForm.module.css";

function SignUpForm() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://carbookingbackend-df57468af270.herokuapp.com/carbooking/register/",
        {
          email: formData.email,
          password: formData.password,
          username: formData.email,
          full_name: formData.name,
        }
      );
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.email?.[0] || "Registration failed");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.authFormContainer}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2>Sign Up</h2>
        {error && <div className={styles.error}>{error}</div>}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <a href="/signin">Sign in</a>
      </p>
    </div>
  );
}

export default SignUpForm;