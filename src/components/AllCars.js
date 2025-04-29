import React, { useState, useEffect } from "react";
import styles from "../styles/AllCars.module.css"; 
import CarCard from "./cardetails/CarCard";

const AllCars = () => {
  const [carData, setCarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCarData() {
      try {
        const response = await fetch(
          "https://carbookingbackend-df57468af270.herokuapp.com/carbooking/cars/",
          { method: "GET" }
        );

        if (!response.ok) throw new Error("Failed to fetch car data.");
        const data = await response.json();
        setCarData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCarData();
  }, []);

  return (
    <div className={styles.allCarsContainer}>
      <h1 className={styles.pageTitle}>Our Vehicle Collection</h1>
      
      {loading ? (
        <div className={styles.loader}></div>
      ) : error ? (
        <p className={styles.errorMessage}>{error}</p>
      ) : (
        <div className={styles.carsList}>
          {carData.map((car, index) => (
            <CarCard 
              key={car.id} 
              car={car} 
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCars;