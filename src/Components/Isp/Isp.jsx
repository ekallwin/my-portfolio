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

// Product tokens that browsers add to their own UA string to identify
// themselves, even though they're Chromium-based under the hood. Anthing
// not in this map falls through to the generic extractor below, so new /
// regional browsers (JioSphere, DuckDuckGo, OEM browsers, etc.) still get
// their real name instead of being reported as "Chrome".
const KNOWN_BRAND_TOKENS = [
    ["SamsungBrowser/", "Samsung Internet"],
    ["HeyTapBrowser/", "Heytap Browser"],
    ["OppoBrowser/", "Oppo Browser"],
    ["MiuiBrowser/", "Mi Browser"],
    ["VivoBrowser/", "Vivo Browser"],
    ["HuaweiBrowser/", "Huawei Browser"],
    ["UCBrowser/", "UC Browser"],
    ["UCWEB/", "UC Browser"],
    ["YaBrowser/", "Yandex Browser"],
    ["QQBrowser/", "QQ Browser"],
    ["Puffin/", "Puffin"],
    ["Silk/", "Amazon Silk"],
    ["Vivaldi/", "Vivaldi"],
    ["DuckDuckGo/", "DuckDuckGo"],
    ["JioSphere/", "JioSphere"],
    ["JioPages/", "JioPages"],
];

// Tokens that are part of the underlying engine/compatibility boilerplate,
// not the actual browser name - these are ignored by the generic extractor.
const GENERIC_UA_TOKENS = new Set([
    "Mozilla",
    "AppleWebKit",
    "KHTML",
    "like",
    "Gecko",
    "Chrome",
    "CriOS",
    "FxiOS",
    "EdgiOS",
    "EdgA",
    "Edg",
    "OPiOS",
    "OPT",
    "OPR",
    "Version",
    "Mobile",
    "Safari",
    "Build",
]);

// Looks for any "Name/Version" token the client itself added to the UA
// string that isn't one of the generic engine tokens above. This is what
// catches browsers we haven't explicitly listed (new/regional/rebranded
// Chromium browsers), since they still tell us their own name - we just
// weren't reading it before.
const extractUnknownBrandFromUA = (ua) => {
    const matches = [...ua.matchAll(/([A-Za-z][A-Za-z0-9.\-]*)\/[\d.]+/g)];

    const candidate = matches
        .map((m) => m[1])
        .find((name) => !GENERIC_UA_TOKENS.has(name));

    return candidate || null;
};

const getBrowserFromUA = () => {
    const ua = navigator.userAgent;

    // iOS forces every browser onto WebKit, so non-Safari browsers there
    // identify with their own "*iOS/" token instead of the usual
    // desktop-style token (Chrome/, Firefox/, OPR/). These must be checked
    // first, or they'll be misread as Safari/Chrome below.
    if (ua.includes("EdgiOS/")) {
        return "Microsoft Edge";
    }

    if (ua.includes("OPiOS/") || ua.includes("OPT/")) {
        return "Opera";
    }

    // Named/branded Chromium browsers - check before the generic Chrome/
    // Firefox/Safari fallbacks, since their UA also contains "Chrome/".
    for (const [token, name] of KNOWN_BRAND_TOKENS) {
        if (ua.includes(token)) {
            return name;
        }
    }

    // Desktop / Android style Edge & Opera tokens
    if (ua.includes("Edg/") || ua.includes("EdgA/")) {
        return "Microsoft Edge";
    }

    if (ua.includes("OPR/")) {
        return "Opera";
    }

    if (ua.includes("CriOS/") || ua.includes("Chrome/")) {
        // Not one of the known/branded browsers above - see if the client
        // added its own product token we don't have a friendly name for
        // yet, and show that verbatim rather than defaulting to Chrome.
        const unknownBrand = extractUnknownBrandFromUA(ua);
        if (unknownBrand) {
            return unknownBrand;
        }
        return "Google Chrome";
    }

    if (ua.includes("FxiOS/") || ua.includes("Firefox/")) {
        return "Mozilla Firefox";
    }

    if (ua.includes("Safari/")) {
        return "Safari";
    }

    return extractUnknownBrandFromUA(ua) || "Unknown";
};

// Brave deliberately keeps its user-agent identical to Chrome's (to avoid
// sites blocking/downgrading it), so it can only be detected via this
// feature-detection API, which is async.
const detectBrave = async () => {
    try {
        if (navigator.brave && typeof navigator.brave.isBrave === "function") {
            const isBrave = await navigator.brave.isBrave();
            return !!isBrave;
        }
    } catch {
        // ignore - fall through to UA-based result
    }
    return false;
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

const labelCellSx = {
    color: "rgba(255,255,255,0.6)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    fontWeight: 600,
    whiteSpace: "nowrap",
    verticalAlign: "top",
    width: "40%",
    py: 1.25,
};

const valueCellSx = {
    color: "#fff",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    textAlign: "right",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
    py: 1.25,
};

function IP() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const [network, setNetwork] = useState(getNetworkInfo);
    const [browser, setBrowser] = useState(getBrowserFromUA);

    useEffect(() => {
        let mounted = true;

        detectBrave().then((isBrave) => {
            if (mounted && isBrave) {
                setBrowser("Brave");
            }
        });

        return () => {
            mounted = false;
        };
    }, []);

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
                label: "Protocol Version",
                value: info.type,
            },
            {
                label: "IP Address",
                value: info.ip
            },
            {
                label: "ISP",
                value: info.connection?.isp,
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
            value: browser,
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

                <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
                    <TableBody>
                        {networkRows.map((row) => (
                            <TableRow key={row.label}>
                                <TableCell sx={labelCellSx}>
                                    {row.label}
                                </TableCell>

                                <TableCell sx={valueCellSx}>
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
        <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.label}>
                        <TableCell sx={labelCellSx}>
                            {row.label}
                        </TableCell>

                        <TableCell sx={valueCellSx}>
                            {row.value}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default IP;