import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function LinearDeterminate({ duration = 6000 }) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const intervalTime = 50;
    const totalSteps = duration / intervalTime;
    const increment = 100 / totalSteps;

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress < 100) {
          return Math.min(oldProgress + increment, 100);
        }
        clearInterval(timer);
        return 100;
      });
    }, intervalTime);

    return () => {
      clearInterval(timer);
    };
  }, [duration]);

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: '50px',
          backgroundColor: 'transparent',
          '& .MuiLinearProgress-bar': {
            background: '#007bff',
            borderRadius: '50px',
          }
        }}
      />
    </Box>
  );
}