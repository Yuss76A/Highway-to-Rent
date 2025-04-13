import React from 'react';
import { Link } from 'react-router-dom';
import styles from "../styles/Footer.module.css";

const Footer = () => {
    return (
        <footer className={styles['fixed-footer']}>
            <nav>
                <Link to="/reviews" className={styles['footer-link']}>Reviews</Link>
                <Link to="/contact" className={styles['footer-link']}>Contact Us</Link>
            </nav>
            <p>© 2025 Happy Rental. All rights reserved.</p>
        </footer>
    );
};

export default Footer;