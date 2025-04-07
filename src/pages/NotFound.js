import React from 'react';

const NotFound = () => {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>404 - Page Not Found</h2>
            <p>Oops! The page you are looking for does not exist.</p>
            <a href="/">Go back to the homepage</a>
        </div>
    );
};

export default NotFound;