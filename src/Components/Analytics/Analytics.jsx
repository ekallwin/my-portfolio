
import React, { useEffect, useState } from "react";
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

const extractUnknownBrandFromUA = (ua) => {
    const matches = [
        ...ua.matchAll(
            /([A-Za-z][A-Za-z0-9.-]*)\/[\d.]+/g
        ),
    ];

    const candidate = matches
        .map((match) => match[1])
        .find(
            (name) =>
                !GENERIC_UA_TOKENS.has(name)
        );

    return candidate || null;
};

const isInAppBrowser = (ua) => {
    const inAppTokens = [
        "Instagram",
        "FBAN",
        "FBAV",
        "FB_IAB",
        "FBIOS",
        "FB4A",
        "TikTok",
        "musical_ly",
        "LinkedInApp",
        "Twitter",
        "TwitterAndroid",
        "Snapchat",
        "Reddit",
        "Pinterest",
    ];

    if (
        inAppTokens.some((token) =>
            ua.includes(token)
        )
    ) {
        return true;
    }

    if (
        /Android/i.test(ua) &&
        /;\s*wv\)/i.test(ua)
    ) {
        return true;
    }

    if (
        /Android/i.test(ua) &&
        /\bwv\b/i.test(ua) &&
        /Version\/4\.0/i.test(ua)
    ) {
        return true;
    }

    if (
        /iPhone|iPad|iPod/i.test(ua) &&
        /AppleWebKit/i.test(ua) &&
        !/Safari/i.test(ua) &&
        !/CriOS/i.test(ua) &&
        !/FxiOS/i.test(ua) &&
        !/EdgiOS/i.test(ua) &&
        !/OPiOS/i.test(ua)
    ) {
        return true;
    }

    return false;
};

const getBrowserFromUA = () => {
    const ua = navigator.userAgent;

    if (isInAppBrowser(ua)) {
        return "IABMV";
    }

    if (ua.includes("EdgiOS/")) {
        return "Microsoft Edge";
    }

    if (
        ua.includes("OPiOS/") ||
        ua.includes("OPT/")
    ) {
        return "Opera";
    }

    for (const [token, name] of KNOWN_BRAND_TOKENS) {
        if (ua.includes(token)) {
            return name;
        }
    }

    if (
        ua.includes("Edg/") ||
        ua.includes("EdgA/")
    ) {
        return "Microsoft Edge";
    }

    if (ua.includes("OPR/")) {
        return "Opera";
    }

    if (
        ua.includes("CriOS/") ||
        ua.includes("Chrome/")
    ) {
        const unknownBrand =
            extractUnknownBrandFromUA(ua);

        return unknownBrand || "Google Chrome";
    }

    if (
        ua.includes("FxiOS/") ||
        ua.includes("Firefox/")
    ) {
        return "Mozilla Firefox";
    }

    if (ua.includes("Safari/")) {
        return "Safari";
    }

    return (
        extractUnknownBrandFromUA(ua) ||
        "Unknown"
    );
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

const getDeviceModelFromClientHints = async () => {
    try {
        if (
            navigator.userAgentData &&
            typeof navigator.userAgentData
                .getHighEntropyValues ===
                "function"
        ) {
            const hints =
                await navigator.userAgentData
                    .getHighEntropyValues([
                        "model",
                        "platform",
                    ]);

            if (
                hints &&
                hints.model &&
                hints.model.trim()
            ) {
                return hints.model.trim();
            }
        }
    } catch {
        return null;
    }

    return null;
};

const getDeviceModelFromUA = () => {
    const ua = navigator.userAgent;

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
        const buildMatch = ua.match(
            /;\s*([^;()]+?)\s+Build\//i
        );

        if (buildMatch && buildMatch[1]) {
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

    if (/Macintosh|Mac OS X/i.test(ua)) {
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

const detectBrowser = async () => {
    const browser =
        getBrowserFromUA();

    if (browser === "IABMV") {
        return "IABMV";
    }

    if (
        navigator.brave &&
        typeof navigator.brave.isBrave ===
            "function"
    ) {
        try {
            const brave =
                await navigator.brave.isBrave();

            if (brave) {
                return "Brave";
            }
        } catch {
            return browser;
        }
    }

    return browser;
};

const sendAnalytics = async (
    info,
    browser,
    deviceModel
) => {
    const webhookUrl =
        import.meta.env
            .VITE_ANALYTICS_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn(
            "VITE_ANALYTICS_WEBHOOK_URL is not configured."
        );
        return;
    }

    const now = new Date();

    const parts =
        new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone: "Asia/Kolkata",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            }
        ).formatToParts(now);

    const getPart = (type) => {
        const part = parts.find(
            (item) =>
                item.type === type
        );

        return part
            ? part.value
            : "";
    };

    const payload = {
        timestamp:
            `${getPart("year")}-${getPart("month")}-${getPart("day")} ` +
            `${getPart("hour")}:${getPart("minute")}:${getPart("second")} ` +
            `${getPart("dayPeriod")} IST`,

        ip: info?.ip || "NA",

        type: info?.type || "NA",

        continent:
            info?.continent || "NA",

        country:
            info?.country || "NA",

        isp:
            info?.connection?.isp ||
            "NA",

        Browser:
            browser || "Unknown",

        Platform:
            getPlatform(),

        "Device Model":
            deviceModel || "Unknown",
    };

    const body =
        JSON.stringify(payload);

    try {
        if (
            typeof navigator.sendBeacon ===
            "function"
        ) {
            const blob = new Blob(
                [body],
                {
                    type:
                        "text/plain;charset=UTF-8",
                }
            );

            const sent =
                navigator.sendBeacon(
                    webhookUrl,
                    blob
                );

            if (sent) {
                return;
            }
        }
    } catch {
    }

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
                keepalive: true,
            }
        );
    } catch {
    }
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
        useState(() =>
            getBrowserFromUA()
        );

    const [deviceModel, setDeviceModel] =
        useState("Detecting...");

    useEffect(() => {
        let mounted = true;

        const detectClientDetails =
            async () => {
                try {
                    const detectedBrowser =
                        await detectBrowser();

                    if (mounted) {
                        setBrowser(
                            detectedBrowser
                        );
                    }

                    const model =
                        await getDeviceModel();

                    if (mounted) {
                        setDeviceModel(
                            model || "Unknown"
                        );
                    }
                } catch {
                    if (mounted) {
                        setBrowser(
                            getBrowserFromUA()
                        );

                        setDeviceModel(
                            getDeviceModelFromUA()
                        );
                    }
                }
            };

        detectClientDetails();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        let mounted = true;

        const controller =
            new AbortController();

        const loadData =
            async () => {
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

                    const detectedBrowser =
                        await detectBrowser();

                    const detectedDeviceModel =
                        await getDeviceModel();

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

                    await sendAnalytics(
                        data,
                        detectedBrowser,
                        detectedDeviceModel
                    );
                } catch (err) {
                    if (!mounted) {
                        return;
                    }

                    if (
                        err &&
                        err.name ===
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
                      info.connection?.isp,
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
                tableLayout: "fixed",
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

