import React, { useEffect, useState } from "react";
import { Table, TableBody, TableRow, TableCell, CircularProgress } from "@mui/material";

const getNetworkInfo = () => {
    const conn =
        navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (!conn) {
        return {
            type: "NA",
            effectiveType: "NA",
            downlink: "NA",
            rtt: "NA",
            saveData: "NA",
        };
    }

    const typeLabel = conn.type
        ? conn.type.charAt(0).toUpperCase() + conn.type.slice(1)
        : "NA";

    return {
        type: typeLabel,
        effectiveType: conn.effectiveType
            ? conn.effectiveType.toUpperCase()
            : "NA",
        downlink: conn.downlink != null ? `${conn.downlink} Mbps` : "NA",
        rtt: conn.rtt != null ? `${conn.rtt} ms` : "NA",
        saveData:
            typeof conn.saveData === "boolean"
                ? conn.saveData
                    ? "On"
                    : "Off"
                : "NA",
    };
};

const getBrowser = () => {
    const ua = navigator.userAgent;

    if (ua.includes("Edg/")) {
        return "Microsoft Edge";
    }

    if (ua.includes("Chrome/")) {
        return "Google Chrome";
    }

    if (ua.includes("Firefox/")) {
        return "Mozilla Firefox";
    }

    if (ua.includes("Safari/") && !ua.includes("Chrome/")) {
        return "Safari";
    }

    if (ua.includes("OPR/")) {
        return "Opera";
    }

    return "Unknown";
};

const getPlatform = () => {
    const ua = navigator.userAgent;

    if (/Android/i.test(ua)) {
        return "Android";
    }

    if (/iPhone|iPad|iPod/i.test(ua)) {
        return "iOS";
    }

    if (/Windows/i.test(ua)) {
        return "Windows";
    }

    if (/Macintosh|Mac OS X/i.test(ua)) {
        return "macOS";
    }

    if (/Linux/i.test(ua)) {
        return "Linux";
    }

    return "Unknown";
};

function IP() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const [network, setNetwork] = useState(getNetworkInfo);

    useEffect(() => {
        const conn =
            navigator.connection ||
            navigator.mozConnection ||
            navigator.webkitConnection;

        if (!conn) return;

        const handleChange = () => setNetwork(getNetworkInfo());

        conn.addEventListener("change", handleChange);

        return () => conn.removeEventListener("change", handleChange);
    }, []);

    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();

        (async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_IP_API}`, {
                    signal: controller.signal,
                });

                if (!res.ok) {
                    throw new Error(`Network error: ${res.status}`);
                }

                const data = await res.json();

                if (!mounted) return;

                if (data.success === false) {
                    throw new Error(data.message || "ipwho lookup failed");
                }

                setInfo(data);

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

    const ispRows = info
        ? [
              {
                  label: "Status",
                  value:
                      typeof info.success === "boolean"
                          ? info.success
                              ? "Success"
                              : "Failed"
                          : null,
              },
              {
                  label: "Type",
                  value: info.type,
              },
              {
                  label: "Continent",
                  value: info.continent,
              },
              {
                  label: "Country",
                  value: info.country,
              },
              {
                  label: "Capital",
                  value: info.capital,
              },
              {
                  label: "ISP",
                  value: info.connection?.isp,
              },
              {
                  label: "Timezone",
                  value: info.timezone?.abbr
                      ? `${info.timezone.id} (${info.timezone.abbr})`
                      : info.timezone?.id,
              },
              {
                  label: "UTC",
                  value: info.timezone?.utc,
              },
          ].filter(
              (row) =>
                  row.value !== null &&
                  row.value !== undefined &&
                  row.value !== ""
          )
        : [];

    const networkRows = [
        {
            label: "Estimated Speed",
            value: network.downlink,
        },
        {
            label: "Round-Trip Time",
            value: network.rtt,
        },
        {
            label: "Browser",
            value: getBrowser(),
        },
        {
            label: "Platform",
            value: getPlatform(),
        },
    ];

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "2rem 0",
                }}
            >
                <CircularProgress size={28} sx={{ color: "#8ab4ff" }} />
            </div>
        );
    }

    if (error) {
        return (
            <>
                <p
                    style={{
                        color: "rgba(255,255,255,0.75)",
                        margin: "0 0 1rem",
                    }}
                >
                    Couldn't load connection data: {error}
                </p>

                <Table size="small">
                    <TableBody>
                        {networkRows.map((row) => (
                            <TableRow key={row.label}>
                                <TableCell
                                    sx={{
                                        color: "rgba(255,255,255,0.6)",
                                        borderBottom:
                                            "1px solid rgba(255,255,255,0.1)",
                                        fontWeight: 600,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {row.label}
                                </TableCell>

                                <TableCell
                                    sx={{
                                        color: "#fff",
                                        borderBottom:
                                            "1px solid rgba(255,255,255,0.1)",
                                        textAlign: "right",
                                    }}
                                >
                                    {row.value}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </>
        );
    }

    const rows = [...ispRows, ...networkRows];

    return (
        <Table size="small">
            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.label}>
                        <TableCell
                            sx={{
                                color: "rgba(255,255,255,0.6)",
                                borderBottom:
                                    "1px solid rgba(255,255,255,0.1)",
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {row.label}
                        </TableCell>

                        <TableCell
                            sx={{
                                color: "#fff",
                                borderBottom:
                                    "1px solid rgba(255,255,255,0.1)",
                                textAlign: "right",
                            }}
                        >
                            {row.value}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default IP;