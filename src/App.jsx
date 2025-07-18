import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'react-notifications/lib/notifications.css';
import ScrollToTop from './ScrollToTop';
import Home from "./Home";
import Projects from "./Components/Projects/project";
import Achievements from "./Components/Achievements/achievements";

function App() {

  return (
    <>
    <BrowserRouter>
      <ToastContainer
        position="top-center"
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
      <Routes>
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/achievements" element={<Achievements />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
