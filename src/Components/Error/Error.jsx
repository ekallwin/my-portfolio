import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Error.css';

const Error = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="error-page">
            <div className="error-card">
                <h2>Sorry, this page isn't available</h2>
                <p>The link you followed may be broken, or the page may have been removed.</p>
                <button onClick={handleGoHome}>
                    Go back to Home
                </button>
            </div>
        </div>
    );
};

export default Error;