import './Offline.css';

const OfflinePage = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="offline-container">
      <div className="offline-content">
        <div className="offline-icon">🌐</div>
        <h1 className="offline-title">Connection Lost</h1>
        <p className="offline-message">
          It seems you're offline. Please check your internet connection and try again.
        </p>
        <div className="offline-animation">
          <div className="wifi-symbol">
            <div className="wifi-circle first"></div>
            <div className="wifi-circle second"></div>
            <div className="wifi-circle third"></div>
          </div>
        </div>
        <button 
          onClick={handleRetry}
          className="retry-button"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
};

export default OfflinePage;