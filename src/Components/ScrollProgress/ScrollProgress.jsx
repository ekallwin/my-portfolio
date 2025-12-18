import React, { useState, useEffect } from "react";

const ScrollProgress = () => {
    const [scrollWidth, setScrollWidth] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const appShell = document.querySelector('.app-shell');
            if (!appShell) return;

            const scrollTop = appShell.scrollTop;
            const scrollHeight = appShell.scrollHeight;
            const clientHeight = appShell.clientHeight;

            const totalScroll = scrollHeight - clientHeight;
            const currentScroll = scrollTop;

            if (totalScroll === 0) {
                setScrollWidth(0);
            } else {
                const width = (currentScroll / totalScroll) * 100;
                setScrollWidth(width);
            }
        };

        const appShell = document.querySelector('.app-shell');
        if (appShell) {
            appShell.addEventListener('scroll', handleScroll);
        }

        handleScroll();

        return () => {
            if (appShell) {
                appShell.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    return (
        <div
            style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: "4px",
                background: "#4f46e5",
                width: `${scrollWidth}%`,
                zIndex: 9999,
                transition: "width 0.3s ease-out"
            }}
        />
    );
};

export default ScrollProgress;
