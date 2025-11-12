import React, { useEffect, useState } from "react";

function IP() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);

    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();

        (async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_IP_API}`, { signal: controller.signal });
                if (!res.ok) throw new Error(`Network error: ${res.status}`);
                const data = await res.json();
                if (!mounted) return;
                if (data.success === false) throw new Error(data.message || "ipwho lookup failed");

                setInfo({
                    country: data.country,
                    continent: data.continent,
                    isp: data.connection?.isp || data.isp || data.org || null,
                    domain: data.connection?.domain || data.domain || null,
                });
            } catch (err) {
                if (!mounted) return;
                setError(err.message || String(err));
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
            controller.abort();
        };
    }, []);

    return (
        <span>
            {loading}

            {info && (
                <span>
                    ISP: <strong >{info.isp}</strong> <br />
                    Region: <strong>{info.country}</strong> - <strong>{info.continent}</strong>
                </span>
            )}

            {!loading && !error && !info}
        </span>
    );
}
export default IP;