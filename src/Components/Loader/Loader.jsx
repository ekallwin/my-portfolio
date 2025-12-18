import React from 'react'
import './Loader.css'
import LinearProgress from '@mui/material/LinearProgress';

function Loader({ onFinish }) {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 90) {
                    if (onFinish) onFinish();
                    return 100;
                }
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 100);
            });
        }, 40);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className="loader-wrapper">
            <div style={{ width: '75%' }}>
                <LinearProgress variant="determinate" value={progress} color="secondary" />
                <p style={{ marginTop: '10px', fontFamily: 'monospace' }}>Loading {Math.round(progress)}%</p>
            </div>
        </div>
    )
}

export default Loader