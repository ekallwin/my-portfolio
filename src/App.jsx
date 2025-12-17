import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import toast, { Toaster } from 'react-hot-toast';
import Home from "./Home";
import Projects from "./Components/Projects/project";
import Achievements from "./Components/Achievements/achievements";
import Loader from "./Components/Loader/Loader";
import Orb from './Components/Orb/Orb.jsx';
import FloatingLines from './Components/FloatingLines/FloatingLines';
import OfflinePage from "./Components/Offline/Offline.jsx";
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
            maxWidth: '230px',
            width: '230px',
            color: 'black',
            textAlign: 'left',
          },
        }}
      />

      <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
        {/* <Orb
          hoverIntensity={0}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        /> */}
        <FloatingLines
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[10, 15, 20]}
          lineDistance={[8, 6, 4]}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
          mixBlendMode="normal"
        />
      </div>

      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/achievements" element={<Achievements />} />
          {/* <Route path="/verify" element={<Verify />} /> */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Analytics />
      </div>
    </>
  );
}

export default App;