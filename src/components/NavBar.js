import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { UserContext } from "../contexts/UserContext";

const Navbar = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
  
    function handleLogout() {
      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
    }

    return (
        <nav className="navbar">
          <h1>Car Rental Service</h1>
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
                <li className="logout" onClick={handleLogout}>
                  Logout
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </nav>
      );
    };
    
    export default Navbar;