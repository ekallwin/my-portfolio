import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        const appShell = document.querySelector('.app-shell');
        if (appShell) {
            appShell.scrollTo(0, 0);
        }
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
