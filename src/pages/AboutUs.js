import React from 'react';
import styles from "../styles/AboutUs.module.css";

const AboutUs = () => {
    return (
        <>
            <div className={styles['about-us-container']}>
                <h1 className={styles['about-us-title']}>About Us</h1>
                <div className={styles['about-us-content']}>
                    <p>Welcome to Happy Rental! Founded in 2022 in the picturesque city of Jönköping, Sweden, our mission is simple: to provide visitors with the freedom to explore the stunning region of Småland. Jönköping, known for its scenic lakes and rich cultural heritage, serves as the perfect backdrop for your adventures.</p>
                    <p>At Happy Rental, we believe that discovering the beauty of Småland should be accessible to everyone. What started as a humble operation with just two cars has blossomed into a diverse fleet of six vehicles, and we’re thrilled to announce that we're expecting three more cars to join our collection soon!</p>
                    <p>Our dedicated team of 15 passionate individuals is here to support you every step of the way. We pride ourselves on offering exceptional customer service, with 24-hour assistance available to address any questions or issues that may arise during your rental journey. Your satisfaction is our top priority, and we strive to ensure a seamless experience for all our customers.</p>
                    <p>In addition to our growth in vehicles, we're excited about our plans for the near future. We aim to open a new office in the beautiful city of Umeå, where we will offer an additional fleet of four cars, making it even easier for visitors to access this stunning part of Sweden.</p>
                    <p>Whether you're planning a family getaway, a romantic retreat, or an adventure with friends, we're here to help you create unforgettable memories in Småland and beyond. Join us on this journey, and let Happy Rental be a part of your exploration.</p>
                </div>
            </div>
            
            {/* Notable Achievements Section - outside About Us container */}
            <div className={styles['achievements-section']}>
                <div className={styles['achievement']}>
                    <h3>2022</h3>
                    <p>Celebrated our first year in business with over 500 satisfied customers!</p>
                </div>
                <div className={styles['achievement']}>
                    <h3>2023</h3>
                    <p>Chosen as the best rental company in the Småland region!</p>
                </div>
                <div className={styles['achievement']}>
                    <h3>2024</h3>
                    <p>Expanding our fleet to include eco-friendly vehicles for a better future!</p>
                </div>
                <div className={styles['achievement']}>
                    <h3>2025</h3>
                    <p>Awarded Best Rental Services Company in Sweden!</p>
                </div>
                <div className={styles['achievement']}>
                    <h3>2025</h3>
                    <p>Successfully organized our first fundraising event for social causes, supporting local communities!</p>
                </div>
                <div className={styles['achievement']}>
                    <h3>2025</h3>
                    <p>Launched an initiative to promote sustainable tourism within the Småland region!</p>
                </div>
            </div>
        </>
    );
};

export default AboutUs;