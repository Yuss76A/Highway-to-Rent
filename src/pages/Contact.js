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
    const [fieldErrors, setFieldErrors] = useState({
        name: '',
        email: '',
        message: ''
    });

    const API_URL = 'https://carbookingbackend-df57468af270.herokuapp.com/contact/';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;


        if (!formData.name.trim()) {
            errors.name = 'Name is required';
            isValid = false;
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters';
            isValid = false;
        }

        
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
            isValid = false;
        }

        
        if (!formData.message.trim()) {
            errors.message = 'Message cannot be empty';
            isValid = false;
        }

        setFieldErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatusMessage({ text: '', type: '' });

        
        if (!validateForm()) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(API_URL, formData);
            
            setStatusMessage({
                text: response.data.message || 'Message sent successfully! We will contact you soon.',
                type: 'success'
            });
            
            
            setFormData({
                name: '',
                email: '',
                message: ''
            });
            
        } catch (error) {
            let errorMsg = 'Failed to send message. Please try again later.';
            const newFieldErrors = { name: '', email: '', message: '' };
            
            if (error.response) {
                if (error.response.data) {
                    if (typeof error.response.data === 'object' && !Array.isArray(error.response.data)) {
                        Object.keys(error.response.data).forEach(field => {
                            if (field in newFieldErrors) {
                                newFieldErrors[field] = Array.isArray(error.response.data[field]) 
                                    ? error.response.data[field].join(' ')
                                    : error.response.data[field];
                            }
                        });
                        setFieldErrors(newFieldErrors);
                        errorMsg = 'Please correct the highlighted fields';
                    } 
                    else if (typeof error.response.data === 'string') {
                        errorMsg = error.response.data;
                    } else if (error.response.data.detail) {
                        errorMsg = error.response.data.detail;
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
                
                <div className={styles.description}>
                    <p>Please feel free to reach out to us with any questions you may have regarding car bookings. Our contact form is open to both registered users and those without an account. We look forward to assisting you!</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.contactForm} noValidate>
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
                            className={`${styles.input} ${fieldErrors.name && styles.errorInput}`}
                        />
                        {fieldErrors.name && (
                            <span className={styles.errorText}>{fieldErrors.name}</span>
                        )}
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
                            className={`${styles.input} ${fieldErrors.email && styles.errorInput}`}
                        />
                        {fieldErrors.email && (
                            <span className={styles.errorText}>{fieldErrors.email}</span>
                        )}
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
                            className={`${styles.input} ${styles.textarea} ${fieldErrors.message && styles.errorInput}`}
                        />
                        {fieldErrors.message && (
                            <span className={styles.errorText}>{fieldErrors.message}</span>
                        )}
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
                        <div className={`${styles.statusMessage} ${statusMessage.type === 'success' ? styles.successMessage : styles.errorMessage}`}>
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
