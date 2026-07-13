import React from 'react'
import './Loader.css'
import LinearProgress from '@mui/material/LinearProgress';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const glassTheme = createTheme({
    palette: {
        secondary: {
            main: '#8B5CF6',
            light: '#A78BFA',
            dark: '#7C3AED',
        },
    },
    components: {
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    height: 8,
                    borderRadius: 12,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)',
                },
                bar: {
                    borderRadius: 12,
                    background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)',
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(236, 72, 153, 0.3)',
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                },
            },
        },
    },
});

function Loader({ onFinish }) {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 90) {
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

    React.useEffect(() => {
        if (progress === 100 && onFinish) {
            onFinish();
        }
    }, [progress, onFinish]);

    return (
        <div className="loader-wrapper">
            <div className="glass-container">
                <div className="progress-bar-container">
                    <ThemeProvider theme={glassTheme}>
                        <LinearProgress 
                            variant="determinate" 
                            value={progress} 
                            color="secondary" 
                            sx={{ width: '100%' }}
                        />
                    </ThemeProvider>
                </div>
                <p>Loading {Math.round(progress)}%</p>
            </div>
        </div>
    )
}

export default Loader