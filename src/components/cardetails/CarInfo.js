import React from "react";

const CarInfo = ({ car }) => {
  return (
    <div className="car-info">
      <h2>{car.name}</h2>
      <p>
        <strong>Model:</strong> {car.model}
      </p>
      <p>
        <strong>Year:</strong> {car.year}
      </p>
      <p>
        <strong>Price per Day:</strong> {car.currency} {car.pricePerDay}
      </p>
      <p>
        <strong>Max Passengers:</strong> {car.maxPassengers} Passengers
      </p>
      <p className="description">{car.description}</p>
    </div>
  );
};

export default CarInfo;