import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'react-notifications/lib/notifications.css';
import ScrollToTop from './ScrollToTop';
import Home from "./Home";
import Projects from "./Components/Projects/project";
import Achievements from "./Components/Achievements/achievements";
import Loader from "./Components/Loader/Loader";
import Stars from './Components/Stars/Stars'

function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover={false}
            theme="colored"
            transition={Bounce}
          />
          <ScrollToTop />

          <Stars mouseRepulsion={false}
            mouseInteraction={false}
            density={2}
            glowIntensity={0.3}
            saturation={0.3}
            hueShift={140}
            starSpeed={0.5}
          />

          <div className="app-shell">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </>
      )}
    </>
  );
}

export default App;
