import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext"; 
import styles from "../styles/NavBar.module.css";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  }

  return (
      <nav className={styles.navbar}>
        <h1>Happy Rental</h1>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/browse-cars">All Cars</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/my-rentals">My Rentals</Link>
              </li>
              <li className={styles.logout} onClick={handleLogout}>
                Logout
              </li>
            </>
          ) : (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    );
};

export default NavBar;