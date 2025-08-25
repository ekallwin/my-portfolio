import React, { useEffect, useState } from "react";

function Ip() {
    const [ip, setIp] = useState("");
    const [isp, setIsp] = useState("");
    const word = "IP:";
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchIp() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("https://ipwho.is/", { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            if (data?.success === false) {
                throw new Error(data?.message || "Lookup failed");
            }

            const detectedIp = data?.ip || "Unknown IP";
            const detectedIsp = data?.connection?.isp || data?.org || "Unknown ISP";

            setIp(detectedIp);
            setIsp(detectedIsp);
        } catch (err) {
            setError(err?.message || "Failed to fetch IP info");
            setIp("NA");
            setIsp("NA");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchIp();
    }, []);

    if (loading) {
        return <p>Detecting IP…</p>;
    }

    return <p>{word}&nbsp;&nbsp;{ip} - {isp}</p>;
}

export default Ip;
