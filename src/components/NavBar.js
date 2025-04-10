import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import styles from "../styles/NavBar.module.css";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Initialize Bootstrap's JavaScript
  useEffect(() => {
    if (typeof window !== 'undefined') {
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
      <div className="container-fluid">
        {/* Left-aligned brand title */}
        <Link className={`navbar-brand ${styles.brand}`} to="/">
          Happy Rental
        </Link>

        {/* Mobile toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div className={`collapse navbar-collapse ${styles.navLinksContainer}`} id="navbarContent">
          <div className={`navbar-nav ms-auto ${styles.navLinks}`}>
            <Link className={`nav-link ${styles.navLink}`} to="/">Home</Link>
            
            {user ? (
              <>
                <Link className={`nav-link ${styles.navLink}`} to="/browse-cars">All Cars</Link>
                <Link className={`nav-link ${styles.navLink}`} to="/my-rentals">My Rentals</Link>
                <button 
                  className={`nav-link ${styles.logoutButton}`} 
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link className={`nav-link ${styles.navLink}`} to="/auth">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;