import React, { useState, useEffect } from "react";
import styles from "../styles/AllCars.module.css"; // Make sure this path is correct
import CarCard from "./cardetails/CarCard";

const AllCars = () => {
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
        console.log("Fetching successful:", data);
        setCarData(data);
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    }
    fetchCarData();
  }, []);

  return (
    <div className={styles.allCarsContainer}>
      <h1 className={styles.pageTitle}>Our Vehicle Collection</h1>
      <div className={styles.carsList}>
        {carData.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
};

export default AllCars;