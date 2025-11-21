import React, { useState } from "react";
import verifyData from "./Verify.json";
import "./Verify.css";
import { FaCircleXmark } from "react-icons/fa6";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaClock } from "react-icons/fa";
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Box, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import toast from "react-hot-toast";

function normalizeLink(url) {
    return url
        .toLowerCase()
        .replace(/^https?:\/\/(www\.)?/, "https://")
        .replace(/[#?].*$/, "")
        .replace(/\/+$/, "");
}


async function resolveRedirect(url) {
    try {
        const response = await fetch(url, {
            method: "GET",
            redirect: "follow"
        });
        return response.url || url;
    } catch (e) {
        return url;
    }
}

const stepsTemplate = [
    { id: "init", title: "Verification initialized" },
    { id: "checking", title: "Checking with my social medias" },
    { id: "result", title: "Verification pending" }
];

const SocialVerification = () => {
    const [platform, setPlatform] = useState("");
    const [value, setValue] = useState("");
    const [currentStep, setCurrentStep] = useState(-1);
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasError = false;

        if (!platform) {
            toast.error("Select a social platform!");
            hasError = true;
        }

        if (!value.trim()) {
            toast.error("Enter my username or profile link!");
            hasError = true;
        }

        if (hasError) return;

        const selected = verifyData.socialPlatforms.find(
            (p) => p.socialPlatform === platform
        );

        let input = value.trim().toLowerCase();

        if (input.includes("facebook.com/share")) {
            toast.error(
                "This link is currently not supported.\nUse https://www.facebook.com/{username} format"
            );
            return;
        }


        let isValid = false;

        if (selected) {
            const usernameMatch = selected.username.toLowerCase() === input;

            const normalizedInputForLink = normalizeLink(input);

            const linkMatch = selected.links.some((link) => {
                const normalizedLink = normalizeLink(link);
                return normalizedLink === normalizedInputForLink;
            });

            isValid = usernameMatch || linkMatch;
        }

        setResult(null);
        setCurrentStep(0);

        setTimeout(() => {
            setCurrentStep(1);

            setTimeout(() => {
                setResult(isValid ? "success" : "failed");
                setCurrentStep(2);
            }, 2500);
        }, 1500);
    };

    const steps = stepsTemplate.map((s) => {
        if (s.id !== "result") return s;

        return {
            ...s,
            title:
                result === "failed"
                    ? "This profile is invalid <br/> or does not belong to me"
                    : result === "success"
                        ? "This profile is valid and <br/> belongs to me"
                        : ""
        };
    });

    const closeModal = () => {
        setCurrentStep(-1);
        setResult(null);
    };

    return (
        <div className="sv-wrapper">
            <h3 className="sv-heading">Verify my social handles</h3>

            <form className="sv-form" onSubmit={handleSubmit}>
                <FormControl fullWidth>
                    <InputLabel>Social platform</InputLabel>
                    <Select
                        label="Social platform"
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                    >
                        {verifyData.socialPlatforms.map((p) => (
                            <MenuItem key={p.socialPlatform} value={p.socialPlatform}>
                                {p.socialPlatform}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    label="Username or profile link"
                    placeholder="Enter my username or profile link"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    Verify
                </Button>
                <Box display="flex" alignItems="flex-start" gap={1}>
                    <InfoIcon color="primary" sx={{ mt: "2px" }} />
                    <Typography variant="body1" color="text.secondary">
                        Enter my social media handle so I can confirm its authenticity and detect any fake accounts.
                    </Typography>
                </Box>
            </form>

            {currentStep >= 0 && (
                <div className="sv-modal-backdrop">
                    <div className="sv-modal">
                        <h4 className="sv-modal-title">Verifying profile</h4>

                        <div className="sv-stepper-card">
                            <VerificationStepper
                                steps={steps}
                                currentStep={currentStep}
                                result={result}
                            />
                        </div>

                        {(result === "success" || result === "failed") && (
                            <div class="d-grid gap-2 col-6 mx-auto">
                                <button
                                    type="button"
                                    className="sv-modal-close btn btn-primary"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>

                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const VerificationStepper = ({ steps, currentStep, result }) => {
    const lastIndex = steps.length - 1;

    const getStatus = (index) => {
        if (index === lastIndex && currentStep >= lastIndex) {
            if (result === "success") return "completed";
            if (result === "failed") return "failed";
        }

        if (index < currentStep) return "completed";
        if (index === currentStep) return "current";
        return "upcoming";
    };

    return (
        <div className="vs-container">
            {steps.map((step, index) => {
                const status = getStatus(index);
                const showLine = index !== steps.length - 1;

                let lineState = "upcoming";

                if (index < currentStep) {
                    lineState = "completed";
                }

                if (index + 1 === currentStep && result === null) {
                    lineState = "current";
                }

                if (
                    result === "failed" &&
                    currentStep === lastIndex &&
                    index === lastIndex - 1
                ) {
                    lineState = "failed";
                }

                const subtitleText =
                    status === "completed"
                        ? "Complete"
                        : status === "failed"
                            ? "Verification failed"
                            : status === "current"
                                ? "In progress"
                                : "Pending";

                const subtitleClass =
                    status === "failed"
                        ? "vs-subtitle vs-subtitle-failed"
                        : status === "completed"
                            ? "vs-subtitle vs-subtitle-complete"
                            : status === "current"
                                ? "vs-subtitle vs-subtitle-current"
                                : "vs-subtitle";

                return (
                    <div key={step.id} className="vs-step">
                        <div className="vs-track">
                            <div className="vs-icon-wrapper">
                                {status === "completed" && (
                                    <div className="vs-icon vs-icon-complete">
                                        <IoIosCheckmarkCircle size={32} />
                                    </div>
                                )}

                                {status === "failed" && (
                                    <div className="vs-icon vs-icon-failed">
                                        <FaCircleXmark size={32} />
                                    </div>
                                )}

                                {status === "current" && (
                                    <div className="vs-icon vs-icon-current">
                                        <div className="vs-spinner"></div>
                                        <FaClock size={32} className="vs-clock-icon" />
                                    </div>
                                )}

                                {status === "upcoming" && (
                                    <div className="vs-icon vs-icon-upcoming"></div>
                                )}
                            </div>

                            {showLine && (
                                <div
                                    className={`vs-line vs-line-${lineState}`}
                                    aria-hidden="true"
                                />
                            )}
                        </div>

                        <div className="vs-content">
                            <div className={subtitleClass}>{subtitleText}</div>
                            <div
                                className="vs-title"
                                dangerouslySetInnerHTML={{ __html: step.title }}
                            ></div>

                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SocialVerification;
