import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function WelcomeNotification() {
  const [show, setShow] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.welcome_message) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  if (!show) return null;

  return (
    <div className="welcome-notification">
      Welcome to Happy Rental Jönköping!
    </div>
  );
}
