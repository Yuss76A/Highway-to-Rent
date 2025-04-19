import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Contact.module.css';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

    // Updated to use the correct endpoint
    const API_URL = 'https://carbookingbackend-df57468af270.herokuapp.com/contact/';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatusMessage({ text: '', type: '' });

        try {
            const response = await axios.post(API_URL, formData);
            
            setStatusMessage({
                text: response.data.message || 'Message sent successfully! We will contact you soon.',
                type: 'success'
            });
            
            // Reset form
            setFormData({
                name: '',
                email: '',
                message: ''
            });
            
        } catch (error) {
            let errorMsg = 'Failed to send message. Please try again later.';
            
            if (error.response) {
                if (error.response.data) {
                    if (typeof error.response.data === 'object') {
                        errorMsg = Object.entries(error.response.data)
                            .map(([field, errors]) => `${field}: ${errors.join(' ')}`)
                            .join('\n');
                    } else {
                        errorMsg = error.response.data;
                    }
                }
            } else if (error.request) {
                errorMsg = 'Server is not responding. Please check your connection.';
            }
            
            setStatusMessage({
                text: errorMsg,
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.contactContainer}>
            <div className={styles.contactCard}>
                <h2 className={styles.title}>Contact Us</h2>
                <p className={styles.subtitle}>Have questions about car bookings? Reach out to our team!</p>
                
                <form onSubmit={handleSubmit} className={styles.contactForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>Full Name*</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Your Name"
                            className={styles.input}
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Email*</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your@email.com"
                            className={styles.input}
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="message" className={styles.label}>Your Message*</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="5"
                            placeholder="Tell us about your car booking needs..."
                            className={`${styles.input} ${styles.textarea}`}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className={styles.submitBtn}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className={styles.spinner}></span> Sending...
                            </>
                        ) : (
                            'Send Message'
                        )}
                    </button>
                    
                    {statusMessage.text && (
                        <div className={`${styles.statusMessage} ${styles[statusMessage.type]}`}>
                            {statusMessage.text.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ContactForm;