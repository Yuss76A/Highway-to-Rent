import React, { useState } from "react";
import styles from "../../styles/CarImageSlider.module.css";

const CarImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={styles['image-slider']}>
      <button className={styles['slider-button']} onClick={handlePrev}>
        &#10094; {/* Left arrow */}
      </button>
      {images.length > 0 && (
        <img
          src={images[currentIndex].image}
          alt={images[currentIndex].description}
          className={styles['slider-image']}
        />
      )}
      <button className={styles['slider-button']} onClick={handleNext}>
        &#10095;
      </button>
    </div>
  );
};

export default CarImageSlider;