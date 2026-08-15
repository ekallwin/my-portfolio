import React, { useEffect, useRef, useState } from "react";

import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    CircularProgress,
} from "@mui/material";

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

const GENERIC_TOKENS = new Set([
    "Mozilla",
    "AppleWebKit",
    "KHTML",
    "like",
    "Gecko",
    "Chrome",
    "Chromium",
    "CriOS",
    "FxiOS",
    "Firefox",
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
    "Linux",
    "Android",
    "Windows",
    "Macintosh",
    "Mac",
    "iPhone",
    "iPad",
    "iPod",
    "wv",
]);

const ANALYTICS_SESSION_KEY =
    "analytics_session_id";

const cleanBrandName = (name) =>
    name
        .replace(/[\_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const createSessionId = () => {
    try {
        if (
            window.crypto &&
            typeof window.crypto.randomUUID ===
            "function"
        ) {
            return window.crypto.randomUUID();
        }
    } catch { }

    return (
        `${Date.now()}-` +
        `${Math.random()
            .toString(36)
            .slice(2)}-` +
        `${Math.random()
            .toString(36)
            .slice(2)}`
    );
};

const getAnalyticsSessionId = () => {
    try {
        let id =
            sessionStorage.getItem(
                ANALYTICS_SESSION_KEY
            );

        if (!id) {
            id = createSessionId();

            sessionStorage.setItem(
                ANALYTICS_SESSION_KEY,
                id
            );
        }

        return id;
    } catch {
        return createSessionId();
    }
};

const extractProductTokens = (ua) => {
    const tokens = [];

    const regex =
        /([A-Za-z][A-Za-z0-9._-]*)\/[0-9]+(?:\.[0-9]+)*/g;

    let match;

    while ((match = regex.exec(ua)) !== null) {
        const token = match[1];

        if (!GENERIC_TOKENS.has(token)) {
            tokens.push(token);
        }
    }

    return tokens;
};

const isGenericAndroidWebView = (ua) => {
    return (
        /Android/i.test(ua) &&
        (
            /;\s*wv\)/i.test(ua) ||
            (
                /Version\/4.0/i.test(ua) &&
                /Chrome\//i.test(ua) &&
                /Mobile/i.test(ua)
            )
        )
    );
};

const isGenericIOSWebView = (ua) => {
    if (!/iPhone|iPad|iPod/i.test(ua)) {
        return false;
    }

    if (!/AppleWebKit/i.test(ua)) {
        return false;
    }

    return !(
        /Safari\//i.test(ua) ||
        /CriOS\//i.test(ua) ||
        /FxiOS\//i.test(ua) ||
        /EdgiOS\//i.test(ua) ||
        /OPiOS\//i.test(ua)
    );
};

const getInAppBrowserName = (ua) => {
    const tokens =
        extractProductTokens(ua);

    if (tokens.length > 0) {
        const firstMeaningfulToken =
            tokens[0];

        if (
            firstMeaningfulToken &&
            !GENERIC_TOKENS.has(
                firstMeaningfulToken
            )
        ) {
            return `${cleanBrandName(
                firstMeaningfulToken
            )} Browser`;
        }
    }

    if (isGenericAndroidWebView(ua)) {
        return "Android WebView";
    }

    if (isGenericIOSWebView(ua)) {
        return "iOS WebView";
    }

    return null;
};

const getBrowserFromUA = () => {
    const ua = navigator.userAgent;

    if (/SamsungBrowser\//i.test(ua)) {
        return "Samsung Internet";
    }

    if (/EdgiOS\//i.test(ua)) {
        return "Microsoft Edge";
    }

    if (
        /EdgA\//i.test(ua) ||
        /Edg\//i.test(ua)
    ) {
        return "Microsoft Edge";
    }

    if (
        /OPiOS\//i.test(ua) ||
        /OPT\//i.test(ua)
    ) {
        return "Opera";
    }

    if (/OPR\//i.test(ua)) {
        return "Opera";
    }

    if (
        /FxiOS\//i.test(ua) ||
        /Firefox\//i.test(ua)
    ) {
        return "Mozilla Firefox";
    }

    if (/CriOS\//i.test(ua)) {
        return "Google Chrome";
    }

    if (/Chrome\//i.test(ua)) {
        const inApp =
            getInAppBrowserName(ua);

        if (inApp) {
            return inApp;
        }

        return "Google Chrome";
    }

    if (/Safari\//i.test(ua)) {
        return "Safari";
    }

    for (
        const [token, name]
        of KNOWN_BRAND_TOKENS
    ) {
        if (
            ua
                .toLowerCase()
                .includes(
                    token.toLowerCase()
                )
        ) {
            return name;
        }
    }

    const inApp =
        getInAppBrowserName(ua);

    if (inApp) {
        return inApp;
    }

    return "Unknown";
};

const detectBrowser = async () => {
    if (
        navigator.brave &&
        typeof navigator.brave.isBrave ===
        "function"
    ) {
        try {
            const isBrave =
                await navigator.brave.isBrave();

            if (isBrave) {
                return "Brave";
            }
        } catch { }
    }

    return getBrowserFromUA();
};

const getPlatform = () => {
    const ua =
        navigator.userAgent;

    if (/Android/i.test(ua)) {
        return "Android";
    }

    if (
        /iPhone|iPad|iPod/i.test(ua)
    ) {
        return "iOS";
    }

    if (/Windows/i.test(ua)) {
        return "Windows";
    }

    if (
        /Macintosh|Mac OS X/i.test(ua)
    ) {
        return "macOS";
    }

    if (/Linux/i.test(ua)) {
        return "Linux";
    }

    return "Unknown";
};

const getConnectionType = () => {
    const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

    if (!connection) {
        return "Unknown";
    }

    if (connection.type) {
        const type =
            connection.type.toLowerCase();

        if (type === "wifi") {
            return "WiFi";
        }

        if (type === "cellular") {
            return "Cellular";
        }

        if (type === "ethernet") {
            return "Ethernet";
        }

        if (type === "bluetooth") {
            return "Bluetooth";
        }

        if (type === "none") {
            return "Offline";
        }

        return connection.type;
    }

    if (connection.effectiveType) {
        return connection.effectiveType;
    }

    return "Unknown";
};

const getDeviceModelFromClientHints =
    async () => {
        try {
            if (
                navigator.userAgentData &&
                typeof navigator
                    .userAgentData
                    .getHighEntropyValues ===
                "function"
            ) {
                const hints =
                    await navigator
                        .userAgentData
                        .getHighEntropyValues([
                            "model",
                            "platform",
                        ]);

                if (
                    hints?.model &&
                    hints.model.trim()
                ) {
                    return hints.model.trim();
                }
            }
        } catch { }

        return null;
    };

const getDeviceModelFromUA = () => {
    const ua =
        navigator.userAgent;

    if (/iPhone/i.test(ua)) {
        return "iPhone";
    }

    if (/iPad/i.test(ua)) {
        return "iPad";
    }

    if (/iPod/i.test(ua)) {
        return "iPod";
    }

    if (/Android/i.test(ua)) {
        const buildMatch =
            ua.match(
                /;\s*([^;()]+?)\s+Build\//i
            );

        if (buildMatch?.[1]) {
            const model =
                buildMatch[1].trim();

            if (
                model &&
                !/^wv$/i.test(model) &&
                !/^mobile$/i.test(model) &&
                !/^android$/i.test(model)
            ) {
                return model;
            }
        }

        return "Android Device";
    }

    if (/Windows/i.test(ua)) {
        return "Windows PC";
    }

    if (
        /Macintosh|Mac OS X/i.test(ua)
    ) {
        return "Mac";
    }

    if (/Linux/i.test(ua)) {
        return "Linux PC";
    }

    return "Unknown";
};

const getDeviceModel = async () => {
    const clientHintModel =
        await getDeviceModelFromClientHints();

    if (clientHintModel) {
        return clientHintModel;
    }

    return getDeviceModelFromUA();
};

const formatDuration = (seconds) => {
    const totalSeconds = Math.max(
        0,
        Math.floor(seconds)
    );

    const minutes =
        Math.floor(
            totalSeconds / 60
        );

    const remainingSeconds =
        totalSeconds % 60;

    return `${minutes}M:${String(
        remainingSeconds
    ).padStart(2, "0")}S`;
};

const getISTTimestamp = () => {
    const now = new Date();

    const parts =
        new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone:
                    "Asia/Kolkata",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            }
        ).formatToParts(now);

    const getPart = (type) =>
        parts.find(
            (item) =>
                item.type === type
        )?.value || "";

    return (
        `${getPart("day")}-${getPart(
            "month"
        )}-${getPart("year")} ` +
        `${getPart("hour")}:${getPart(
            "minute"
        )}:${getPart("second")} ` +
        `${getPart("dayPeriod")} IST`
    );
};

const buildAnalyticsPayload = (
    info,
    browser,
    deviceModel,
    connection,
    durationSeconds = null
) => {
    return {
        event:
            durationSeconds !== null
                ? "close"
                : "visit",

        sessionId:
            getAnalyticsSessionId(),

        timestamp:
            getISTTimestamp(),

        ip:
            info?.ip || "NA",

        type:
            info?.type || "NA",

        continent:
            info?.continent || "NA",

        country:
            info?.country || "NA",

        org:
            info?.connection?.org ||
            "NA",

        isp:
            info?.connection?.isp ||
            "NA",

        Browser:
            browser || "Unknown",

        Platform:
            getPlatform(),

        "Device Model":
            deviceModel || "Unknown",

        Connection:
            connection || "Unknown",

        Duration:
            durationSeconds !== null
                ? formatDuration(
                    durationSeconds
                )
                : "",
    };
};

const sendVisitAnalytics = async (
    info,
    browser,
    deviceModel,
    connection
) => {
    const webhookUrl = `https://script.google.com/macros/s/${import.meta.env.VITE_ANALYTICS_WEBHOOK_ID}/exec`;

    if (!webhookUrl) {
        return false;
    }

    const payload =
        buildAnalyticsPayload(
            info,
            browser,
            deviceModel,
            connection
        );

    const body =
        JSON.stringify(payload);

    try {
        await fetch(
            webhookUrl,
            {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type":
                        "text/plain;charset=UTF-8",
                },
                body,
            }
        );

        return true;
    } catch {
        return false;
    }
};

const sendCloseAnalytics = ({
    info,
    browser,
    deviceModel,
    connection,
    durationSeconds,
}) => {
    const scriptId = import.meta.env.VITE_ANALYTICS_WEBHOOK_ID;

    if (!scriptId) {
        return false;
    }

    const webhookUrl = `https://script.google.com/macros/s/${scriptId}/exec`;

    if (!webhookUrl) {
        return false;
    }

    const payload =
        buildAnalyticsPayload(
            info,
            browser,
            deviceModel,
            connection,
            durationSeconds
        );

    const body =
        JSON.stringify(payload);

    try {
        if (
            typeof navigator.sendBeacon ===
            "function"
        ) {
            const blob =
                new Blob(
                    [body],
                    {
                        type:
                            "text/plain;charset=UTF-8",
                    }
                );

            return navigator.sendBeacon(
                webhookUrl,
                blob
            );
        }
    } catch { }

    return false;
};

const labelCellSx = {
    color:
        "rgba(255,255,255,0.6)",
    borderBottom:
        "1px solid rgba(255,255,255,0.1)",
    fontWeight: 600,
    whiteSpace: "nowrap",
    verticalAlign: "top",
    width: "40%",
    py: 1.25,
};

const valueCellSx = {
    color: "#fff",
    borderBottom:
        "1px solid rgba(255,255,255,0.1)",
    textAlign: "right",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
    py: 1.25,
};

function WebAnalytics() {
    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const [info, setInfo] =
        useState(null);

    const [browser, setBrowser] =
        useState("Detecting...");

    const [deviceModel, setDeviceModel] =
        useState("Detecting...");

    const [connection, setConnection] =
        useState(
            getConnectionType()
        );

    const analyticsInfoRef =
        useRef(null);

    const browserRef =
        useRef("Unknown");

    const deviceModelRef =
        useRef("Unknown");

    const connectionRef =
        useRef(
            getConnectionType()
        );

    const activeStartRef =
        useRef(
            document.visibilityState ===
                "visible"
                ? performance.now()
                : null
        );

    const activeDurationRef =
        useRef(0);

    const closeSentRef =
        useRef(false);

    useEffect(() => {
        getAnalyticsSessionId();
    }, []);

    useEffect(() => {
        let mounted = true;

        const detect = async () => {
            try {
                const detectedBrowser =
                    await detectBrowser();

                const model =
                    await getDeviceModel();

                const detectedConnection =
                    getConnectionType();

                if (!mounted) {
                    return;
                }

                setBrowser(
                    detectedBrowser
                );

                setDeviceModel(
                    model || "Unknown"
                );

                setConnection(
                    detectedConnection
                );

                browserRef.current =
                    detectedBrowser;

                deviceModelRef.current =
                    model || "Unknown";

                connectionRef.current =
                    detectedConnection;
            } catch {
                if (!mounted) {
                    return;
                }

                const fallbackBrowser =
                    getBrowserFromUA();

                const fallbackModel =
                    getDeviceModelFromUA();

                const fallbackConnection =
                    getConnectionType();

                setBrowser(
                    fallbackBrowser
                );

                setDeviceModel(
                    fallbackModel
                );

                setConnection(
                    fallbackConnection
                );

                browserRef.current =
                    fallbackBrowser;

                deviceModelRef.current =
                    fallbackModel;

                connectionRef.current =
                    fallbackConnection;
            }
        };

        detect();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        const handleConnectionChange =
            () => {
                const type =
                    getConnectionType();

                setConnection(type);

                connectionRef.current =
                    type;
            };

        const network =
            navigator.connection ||
            navigator.mozConnection ||
            navigator.webkitConnection;

        if (network) {
            network.addEventListener(
                "change",
                handleConnectionChange
            );
        }

        window.addEventListener(
            "online",
            handleConnectionChange
        );

        window.addEventListener(
            "offline",
            handleConnectionChange
        );

        return () => {
            if (network) {
                network.removeEventListener(
                    "change",
                    handleConnectionChange
                );
            }

            window.removeEventListener(
                "online",
                handleConnectionChange
            );

            window.removeEventListener(
                "offline",
                handleConnectionChange
            );
        };
    }, []);

    useEffect(() => {
        let mounted = true;

        const controller =
            new AbortController();

        const loadData = async () => {
            try {
                const apiUrl =
                    import.meta.env
                        .VITE_IP_API;

                if (!apiUrl) {
                    throw new Error(
                        "VITE_IP_API is not configured."
                    );
                }

                const response =
                    await fetch(
                        apiUrl,
                        {
                            signal:
                                controller.signal,
                        }
                    );

                if (!response.ok) {
                    throw new Error(
                        `Network error: ${response.status}`
                    );
                }

                const data =
                    await response.json();

                if (!mounted) {
                    return;
                }

                if (
                    data.success ===
                    false
                ) {
                    throw new Error(
                        data.message ||
                        "IP lookup failed"
                    );
                }

                setInfo(data);

                analyticsInfoRef.current =
                    data;

                const detectedBrowser =
                    await detectBrowser();

                const detectedDeviceModel =
                    await getDeviceModel();

                const detectedConnection =
                    getConnectionType();

                if (!mounted) {
                    return;
                }

                setBrowser(
                    detectedBrowser
                );

                setDeviceModel(
                    detectedDeviceModel ||
                    "Unknown"
                );

                setConnection(
                    detectedConnection
                );

                browserRef.current =
                    detectedBrowser;

                deviceModelRef.current =
                    detectedDeviceModel ||
                    "Unknown";

                connectionRef.current =
                    detectedConnection;

                await sendVisitAnalytics(
                    data,
                    detectedBrowser,
                    detectedDeviceModel,
                    detectedConnection
                );
            } catch (err) {
                if (!mounted) {
                    return;
                }

                if (
                    err?.name ===
                    "AbortError"
                ) {
                    return;
                }

                setError(
                    err?.message ||
                    String(err)
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadData();

        return () => {
            mounted = false;

            controller.abort();
        };
    }, []);

    useEffect(() => {
        const startActiveTime = () => {
            if (
                activeStartRef.current ===
                null
            ) {
                activeStartRef.current =
                    performance.now();
            }
        };

        const pauseActiveTime = () => {
            if (
                activeStartRef.current !==
                null
            ) {
                activeDurationRef.current +=
                    performance.now() -
                    activeStartRef.current;

                activeStartRef.current =
                    null;
            }
        };

        const getActiveSeconds = () => {
            let duration =
                activeDurationRef.current;

            if (
                activeStartRef.current !==
                null
            ) {
                duration +=
                    performance.now() -
                    activeStartRef.current;
            }

            return Math.floor(
                duration / 1000
            );
        };

        const sendClose = () => {
            if (
                closeSentRef.current
            ) {
                return;
            }

            closeSentRef.current =
                true;

            pauseActiveTime();

            const durationSeconds =
                getActiveSeconds();

            sendCloseAnalytics({
                info:
                    analyticsInfoRef.current,

                browser:
                    browserRef.current,

                deviceModel:
                    deviceModelRef.current,

                connection:
                    connectionRef.current,

                durationSeconds,
            });
        };

        const handleVisibilityChange =
            () => {
                if (
                    document.visibilityState ===
                    "visible"
                ) {
                    startActiveTime();
                } else {
                    pauseActiveTime();
                }
            };

        const handlePageHide = () => {
            sendClose();
        };

        const handleBeforeUnload = () => {
            sendClose();
        };

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        window.addEventListener(
            "pagehide",
            handlePageHide
        );

        window.addEventListener(
            "beforeunload",
            handleBeforeUnload
        );

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );

            window.removeEventListener(
                "pagehide",
                handlePageHide
            );

            window.removeEventListener(
                "beforeunload",
                handleBeforeUnload
            );
        };
    }, []);

    const ispRows = info
        ? [
            {
                label: "Status",
                value:
                    typeof info.success ===
                        "boolean"
                        ? info.success
                            ? "Success"
                            : "Failed"
                        : null,
            },
            {
                label:
                    "Protocol Version",
                value: info.type,
            },
            {
                label:
                    "IP Address",
                value: info.ip,
            },
            {
                label: "ISP",
                value:
                    info.connection
                        ?.isp,
            },
            {
                label: "Organization",
                value: info.connection?.org,
            },
            {
                label:
                    "Continent",
                value:
                    info.continent,
            },
            {
                label:
                    "Country",
                value:
                    info.country,
            },
            {
                label:
                    "Timezone",
                value:
                    info.timezone?.abbr
                        ? `${info.timezone.id} (${info.timezone.abbr})`
                        : info.timezone?.id,
            },
            {
                label: "UTC",
                value:
                    info.timezone?.utc,
            },
        ].filter(
            (row) =>
                row.value !== null &&
                row.value !==
                undefined &&
                row.value !== ""
        )
        : [];

    const browserRows = [
        {
            label: "Browser",
            value: browser,
        },
        {
            label: "Platform",
            value: getPlatform(),
        },
        {
            label:
                "Device Model",
            value: deviceModel,
        },
        {
            label:
                "Connection",
            value: connection,
        },
    ];

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "center",
                    padding:
                        "2rem 0",
                }}
            >
                <CircularProgress
                    size={28}
                    sx={{
                        color:
                            "#8ab4ff",
                    }}
                />
            </div>
        );
    }

    if (error) {
        return (
            <>
                <p
                    style={{
                        color:
                            "rgba(255,255,255,0.75)",
                        margin:
                            "0 0 1rem",
                    }}
                >
                    Couldn't load
                    connection data:{" "}
                    {error}
                </p>

                <Table
                    size="small"
                    sx={{
                        tableLayout:
                            "fixed",
                        width: "100%",
                    }}
                >
                    <TableBody>
                        {browserRows.map(
                            (row) => (
                                <TableRow
                                    key={
                                        row.label
                                    }
                                >
                                    <TableCell
                                        sx={
                                            labelCellSx
                                        }
                                    >
                                        {
                                            row.label
                                        }
                                    </TableCell>

                                    <TableCell
                                        sx={
                                            valueCellSx
                                        }
                                    >
                                        {
                                            row.value
                                        }
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </>
        );
    }

    const rows = [
        ...ispRows,
        ...browserRows,
    ];

    return (
        <Table
            size="small"
            sx={{
                tableLayout:
                    "fixed",
                width: "100%",
            }}
        >
            <TableBody>
                {rows.map((row) => (
                    <TableRow
                        key={row.label}
                    >
                        <TableCell
                            sx={
                                labelCellSx
                            }
                        >
                            {row.label}
                        </TableCell>

                        <TableCell
                            sx={
                                valueCellSx
                            }
                        >
                            {row.value}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default WebAnalytics;