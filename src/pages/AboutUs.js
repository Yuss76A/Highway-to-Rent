import React from 'react';
import styles from "../styles/AboutUs.module.css";
import backgroundImage from '../assets/car.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, 
  faLeaf, 
  faHandHoldingHeart,
  faSignInAlt, 
  faCalendarAlt, 
  faCar, 
  faClipboardCheck, 
  faPhone, 
  faSmile 
} from '@fortawesome/free-solid-svg-icons';

const AboutUs = () => {
    return (
        <>
            <div className={styles['image-container']}>
                <img 
                    src={backgroundImage} 
                    alt="Background" 
                    className={styles['background-image']} 
                />
            </div>
            
            <div className={styles['about-us-container']}>
                <h1 className={styles['about-us-title']}>About Us</h1>
                <div className={styles['about-us-content']}>
                    <p>
                        Welcome to Happy Rental! Founded in 2022 in the picturesque city of Jönköping, Sweden, 
                        our mission is simple: to provide visitors with the freedom to explore the stunning 
                        region of Småland. Jönköping, known for its scenic lakes and rich cultural heritage, 
                        serves as the perfect backdrop for your adventures.
                    </p>
                    <p>
                        At Happy Rental, we believe that discovering the beauty of Småland should be accessible 
                        to everyone. What started as a humble operation with just two cars has blossomed into 
                        a diverse fleet of six vehicles, and we're thrilled to announce that we're expecting 
                        three more cars to join our collection soon!
                    </p>
                    <p>
                        Our dedicated team of 15 passionate individuals is here to support you every step of 
                        the way. We pride ourselves on offering exceptional customer service, with 24-hour 
                        assistance available to address any questions or issues that may arise during your 
                        rental journey. Your satisfaction is our top priority, and we strive to ensure a 
                        seamless experience for all our customers.
                    </p>
                    <p>
                        In addition to our growth in vehicles, we're excited about our plans for the near 
                        future. We aim to open a new office in the beautiful city of Umeå, where we will 
                        offer an additional fleet of four cars, making it even easier for visitors to access 
                        this stunning part of Sweden.
                    </p>
                    <p>
                        Whether you're planning a family getaway, a romantic retreat, or an adventure with 
                        friends, we're here to help you create unforgettable memories in Småland and beyond. 
                        Join us on this journey, and let Happy Rental be a part of your exploration.
                    </p>
                    <p>
                        You can find our offices at Dvärggatan 15, 553 02 Jönköping. Our telephone number is 
                        073-4587898. Our offices are open from 7 in the morning until 16:30. Please visit our 
                        <a href="/booking"> rent page</a> for more information.
                    </p>
                </div>
            </div>
            
            {/* Notable Achievements Section */}
            <div className={styles['achievements-section']}>
                <div className={styles['achievement']}>
                    <FontAwesomeIcon icon={faTrophy} className={styles['achievement-icon']} />
                    <h3>2022</h3>
                    <p>Celebrated our first year in business with over 500 satisfied customers!</p>
                </div>
                <div className={styles['achievement']}>
                    <FontAwesomeIcon icon={faTrophy} className={styles['achievement-icon']} />
                    <h3>2023</h3>
                    <p>Chosen as the best rental company in the Småland region!</p>
                </div>
                <div className={styles['achievement']}>
                    <FontAwesomeIcon icon={faLeaf} className={styles['achievement-icon']} />
                    <h3>2024</h3>
                    <p>Expanding our fleet to include eco-friendly vehicles for a better future!</p>
                </div>
                <div className={styles['achievement']}>
                    <FontAwesomeIcon icon={faTrophy} className={styles['achievement-icon']} />
                    <h3>2025</h3>
                    <p>Awarded Best Rental Services Company in Sweden!</p>
                </div>
                <div className={styles['achievement']}>
                    <FontAwesomeIcon icon={faHandHoldingHeart} className={styles['achievement-icon']} />
                    <h3>2025</h3>
                    <p>Successfully organized our first fundraising event for social causes!</p>
                </div>
                <div className={styles['achievement']}>
                    <FontAwesomeIcon icon={faLeaf} className={styles['achievement-icon']} />
                    <h3>2025</h3>
                    <p>Launched an initiative to promote sustainable tourism within the Småland region!</p>
                </div>
            </div>

            {/* Rental Process Section */}
            <div className={styles['rental-process']}>
            <h2 className={styles['how-it-works-title']}>How It Works</h2>
                <div className={styles['process-steps']}>
                    <div className={styles['process-step-left']}>
                        <FontAwesomeIcon icon={faSignInAlt} className={styles['step-icon']} />
                        <h3>1. Sign In</h3>
                        <p>First, sign in to your account. If you don't have one, create one!</p>
                    </div>
                    <div className={styles['process-step-right']}>
                        <FontAwesomeIcon icon={faCalendarAlt} className={styles['step-icon']} />
                        <h3>2. Choose Dates</h3>
                        <p>Go to the rent page and choose your start and end date.</p>
                    </div>
                    <div className={styles['process-step-left']}>
                        <FontAwesomeIcon icon={faCar} className={styles['step-icon']} />
                        <h3>3. Book a Car</h3>
                        <p>Book your favorite car from our available options.</p>
                    </div>
                    <div className={styles['process-step-right']}>
                        <FontAwesomeIcon icon={faClipboardCheck} className={styles['step-icon']} />
                        <h3>4. View Rentals</h3>
                        <p>You can view your rented car in the 'My Rentals' section.</p>
                    </div>
                    <div className={styles['process-step-left']}>
                        <FontAwesomeIcon icon={faPhone} className={styles['step-icon']} />
                        <h3>5. Need Help?</h3>
                        <p>If you have a problem after our working hours, no worries! Our telephone is connected to 24-hour assistance.</p>
                    </div>
                    <div className={styles['process-step-right']}>
                        <FontAwesomeIcon icon={faSmile} className={styles['step-icon']} />
                        <h3>6. Enjoy Your Stay</h3>
                        <p>Enjoy your stay in Sweden!</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AboutUs;
