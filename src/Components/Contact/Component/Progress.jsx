import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function LinearDeterminate({ duration = 2000, onComplete }) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const intervalTime = 50;
    const totalSteps = duration / intervalTime;
    const increment = 100 / totalSteps;

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          if (onComplete) onComplete();
          return 100;
        }
        return Math.min(oldProgress + increment, 100);
      });
    }, intervalTime);

    return () => {
      clearInterval(timer);
    };
  }, [duration, onComplete]);

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: '50px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          '& .MuiLinearProgress-bar': {
            background: '#007bff',
            borderRadius: '50px',
          }
        }}
      />
    </Box>
  );
}