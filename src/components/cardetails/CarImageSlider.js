import React, { useState } from "react";
import styles from "../../styles/CarImageSlider.module.css";

const CarImageSlider = ({ images, showNavigation = false }) => {
  const [currentIndex] = useState(0);

  return (
    <div className={`${styles['image-slider']} ${showNavigation ? styles['show-navigation'] : ''}`}>
      {showNavigation && (
        <>
          <button className={styles['slider-button']} onClick={() => {}}>
            &#10094;
          </button>
          <button className={styles['slider-button']} onClick={() => {}}>
            &#10095;
          </button>
        </>
      )}
      {images.length > 0 && (
        <img
          src={images[currentIndex].image}
          alt={images[currentIndex].description}
          className={styles['slider-image']}
        />
      )}
    </div>
  );
};

export default CarImageSlider;