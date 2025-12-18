import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from "react";
import "./App.css";
import toast, { Toaster } from 'react-hot-toast';
import Loader from "./Components/Loader/Loader";
import SimpleBackground from './Components/SimpleBackground/SimpleBackground';
import OfflinePage from "./Components/Offline/Offline.jsx";
import { Analytics } from "@vercel/analytics/react"
import Navbar from "./Components/Navbar/navbar.jsx";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop.jsx";

const Home = lazy(() => import("./Home"));
const Projects = lazy(() => import("./Components/Projects/project.jsx"));
const Achievements = lazy(() => import("./Components/Achievements/achievements"));
const Education = lazy(() => import("./Components/Education/Education"));

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

  const [initialLoad, setInitialLoad] = useState(true);

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

      {initialLoad && <Loader onFinish={() => setInitialLoad(false)} />}

      <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
        <SimpleBackground />
      </div>

      <div className="app-shell">
        <ScrollToTop />
        <Suspense fallback={<Loader />}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/education" element={<Education />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Analytics />
      </div>
    </>
  );
}

export default App;