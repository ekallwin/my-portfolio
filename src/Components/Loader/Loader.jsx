import React from 'react'
import './Loader.css'
function Loader() {
    return (
        <>
            <div className="loader-wrapper">
                <svg className="spinner" viewBox="25 25 50 50">
                    <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="4" />
                </svg>
                <p>Loading</p>
            </div>
        </>
    )
}

export default Loader