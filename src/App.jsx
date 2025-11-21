import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import toast, { Toaster } from 'react-hot-toast';
import Home from "./Home";
import Projects from "./Components/Projects/project";
import Achievements from "./Components/Achievements/achievements";
import Loader from "./Components/Loader/Loader";
import Orb from './Components/Orb/Orb.jsx';
import OfflinePage from "./Components/Offline/Offline.jsx";
import Verify from "./Components/Verify/Verifycontainer.jsx";
import { Analytics } from "@vercel/analytics/react"

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

function App() {
  const isOnline = useOnlineStatus();

  if (!isOnline) {
    return <OfflinePage />;
  }

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={true}
        toastOptions={{
          className: '',
          style: {
            whiteSpace: "nowrap",
            maxWidth: '350px',
            width: '350px',
            color: 'black',
            textAlign: 'left',
          },
        }}
      />

      <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
        <Orb
          hoverIntensity={0}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>

      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Analytics />
      </div>
    </>
  );
}

export default App;