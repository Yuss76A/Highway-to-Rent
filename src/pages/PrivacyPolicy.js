import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/PrivacyPolicy.module.css';

const PrivacyPolicy = () => {
  return (
    <div className={styles.policyContainer}>
      <header className={styles.header}>
        <h1>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last Updated: June 2024</p>
      </header>

      <section className={styles.section}>
        <h2>1. Information We Collect</h2>
        <p>
          When you rent a car through Happy Rental, we may collect:
        </p>
        <ul>
          <li><strong>Personal Information:</strong> Name, email, phone number, driver's license details</li>
          <li><strong>Payment Information:</strong> Credit card details (processed securely)</li>
          <li><strong>Rental Details:</strong> Pickup/drop-off locations, dates, vehicle preferences</li>
          <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>2. How We Use Your Information</h2>
        <p>Your data helps us to:</p>
        <ul>
          <li>Process and manage your rental reservations</li>
          <li>Provide customer support and communicate important updates</li>
          <li>Improve our services and website functionality</li>
          <li>Comply with legal and regulatory requirements</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>3. Data Sharing</h2>
        <p>We may share your information with:</p>
        <ul>
          <li>Payment processors to complete transactions</li>
          <li>Insurance providers for rental coverage</li>
          <li>Government authorities when required by law</li>
        </ul>
        <p>We <strong>never</strong> sell your personal data to third parties.</p>
      </section>

      <section className={styles.section}>
        <h2>4. Data Security</h2>
        <p>
          We implement industry-standard security measures including:
        </p>
        <ul>
          <li>SSL encryption for all data transmissions</li>
          <li>Secure storage of sensitive information</li>
          <li>Regular security audits</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>5. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access, update, or delete your personal information</li>
          <li>Opt-out of marketing communications</li>
          <li>Request a copy of your data</li>
          <li>Withdraw consent where applicable</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>6. Contact Us</h2>
        <p>
          For privacy-related inquiries, please visit our{' '}
          <Link to="/contact" className={styles.link}>Contact Page</Link>.
        </p>
      </section>

      <footer className={styles.footer}>
        <p>This policy is effective as of the last updated date above.</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;