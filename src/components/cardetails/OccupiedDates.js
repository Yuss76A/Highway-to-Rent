import React from "react";

const ReservedDates = ({ dates }) => {
  return (
    <div className="reserved-dates">
      <h4>Reserved Dates</h4>
      {dates.length > 0 ? (
        <ul>
          {dates.map((date, index) => (
            <li key={index}>
              {date.date} - {date.reserverInfo.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming reservations.</p>
      )}
    </div>
  );
};

export default ReservedDates;