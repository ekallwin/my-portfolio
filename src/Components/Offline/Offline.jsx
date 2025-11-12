import './Offline.css';
import { PiGlobeXLight } from "react-icons/pi";

const OfflinePage = () => {
  return (
    <div className="offline-container">
      <div className="offline-content">
        <div className='globe-internet'>
          <PiGlobeXLight size={70} />
        </div>

        <h2 className="offline-title">No Internet</h2>
        <p className="offline-message">Try:</p>
        <ul className="offline-tips">
          <li>Checking the network cables, modem, and router</li>
          <li>Reconnecting to Wi-Fi</li>
          <li>Turning off Airplane mode</li>
        </ul>
      </div>
    </div>
  );
};

export default OfflinePage;