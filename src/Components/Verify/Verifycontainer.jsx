import React from 'react'
import { useEffect } from 'react'
import Navbar from '../Navbar/navbar'
import Footer from '../Footer/footer'
import Verify from './Verify/Verify.jsx'
function Verification() {
    useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, []);
    
    return (
        <>
            <Navbar />
            <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                <Verify />
            </div>
            <Footer />
        </>
    )
}

export default Verification