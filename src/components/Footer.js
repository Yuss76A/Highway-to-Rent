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
            <div className={styles['social-links']}>
                <a href="https://www.instagram.com/YourInstagramHandle" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   aria-label="Instagram">
                    <i className="fab fa-instagram"></i>
                </a>
                <a href="https://www.facebook.com/YourFacebookPage" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   aria-label="Facebook">
                    <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://www.tiktok.com/@YourTikTokHandle" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   aria-label="TikTok">
                    <i className="fab fa-tiktok"></i>
                </a>
                <a href="https://twitter.com/YourTwitterHandle" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   aria-label="Twitter">
                    <i className="fab fa-twitter"></i>
                </a>
            </div>
            <p className={styles['copyright']}>© 2025 Happy Rental. All rights reserved.</p>
        </footer>
    );
};

export default Footer;