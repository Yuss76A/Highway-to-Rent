import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import styles from "../styles/NavBar.module.css";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
      <div className="container-fluid">
        <Link className={`navbar-brand ${styles.brand}`} to="/">
          Happy Rental Jönköping
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars"></i>
        </button>

        <div className={`collapse navbar-collapse ${styles.navLinksContainer}`} id="navbarContent">
          <div className={`navbar-nav ms-auto ${styles.navLinks}`}>
            <Link className={`nav-link ${styles.navLink}`} to="/about-us">About Us</Link>
            <Link className={`nav-link ${styles.navLink}`} to="/booking">Rent</Link>
            <Link className={`nav-link ${styles.navLink}`} to="/browse-cars">All Cars</Link>
            <Link className={`nav-link ${styles.navLink}`} to="/reviews">
              <i className="fas fa-star me-1"></i> Reviews
            </Link>
            
            {user ? (
              <>
                <Link className={`nav-link ${styles.navLink}`} to="/my-rentals">My Rentals</Link>
                <Link 
                  className={`nav-link ${styles.navLink}`} 
                  to="#"
                  onClick={handleLogout}
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link className={`nav-link ${styles.navLink}`} to="/signin">Login</Link>
                <Link className={`nav-link ${styles.navLink}`} to="/signup">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;