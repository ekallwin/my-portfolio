import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Download } from 'lucide-react';

function DownloadProgress({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        let current = 0;

        const interval = setInterval(() => {
            // Simulate realistic download progress
            if (current < 30) {
                current += Math.random() * 8;
            } else if (current < 70) {
                current += Math.random() * 12;
            } else if (current < 90) {
                current += Math.random() * 5;
            } else {
                current += Math.random() * 2;
            }

            if (current >= 100) {
                current = 100;
                clearInterval(interval);
                setProgress(100);
                setIsComplete(true);

                // Call onComplete after a brief delay
                setTimeout(() => {
                    if (onComplete) onComplete();
                }, 500);
            } else {
                setProgress(Math.floor(current));
            }
        }, 200);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <Box sx={{ width: '100%', textAlign: 'center' }}>
            {/* Icon */}
            <Box sx={{ mb: 2, color: '#667eea', display: 'flex', justifyContent: 'center' }}>
                <Box
                    sx={{
                        width: 68,
                        height: 68,
                        borderRadius: '50%',
                        border: '2px solid #667eea',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(102, 126, 234, 0.35)',
                    }}
                >
                    <Download size={32} strokeWidth={2.2} />
                </Box>
            </Box>

            {/* Title */}
            <Typography variant="h5" fontWeight="bold" textAlign="center" sx={{ mb: 1, color: '#fff' }}>
                Downloading Resume
            </Typography>

            {/* Subtitle */}
            <Typography variant="body2" textAlign="center" sx={{ mb: 3, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                Please wait while my resume is being downloaded
            </Typography>

            {/* Progress bar background */}
            <Box
                sx={{
                    width: '100%',
                    height: '10px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    marginBottom: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)',
                }}
            >
                {/* Progress fill */}
                <Box
                    sx={{
                        height: '100%',
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '10px',
                        transition: 'width 0.3s ease-out',
                        boxShadow: '0 0 16px rgba(102, 126, 234, 0.8)',
                    }}
                />
            </Box>

            {/* Percentage */}
            <Typography
                sx={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: '#667eea',
                }}
            >
                {progress}% Complete
            </Typography>
        </Box>
    );
}

export default DownloadProgress;