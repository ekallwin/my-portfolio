import React, { useState, useEffect, useRef, useMemo } from "react";
import './contact.css';
import { toast } from '../GlassNotification/glass-notification';
import { Filter } from 'bad-words';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Fade,
  Slide,
  useTheme,
  CircularProgress,
  Modal,
  Backdrop,
  Rating,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import Tooltip from '@mui/material/Tooltip';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Send as SendIcon, Close as CloseIcon } from "@mui/icons-material";
import GreenTickSuccess from "./Component/Success";
import moment from "moment";
import { parsePhoneNumberFromString, AsYouType, getCountries, getCountryCallingCode } from "libphonenumber-js";
import ReactSelect from "react-select";

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [hidePhone, setHidePhone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [countryCode, setCountryCode] = useState("+91");
  const [countryIso, setCountryIso] = useState("IN");
  const [isLoadingCountry, setIsLoadingCountry] = useState(true);
  const [userCountry, setUserCountry] = useState("");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [isManuallySelected, setIsManuallySelected] = useState(false);

  const countryOptions = useMemo(() => {
    const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
    return getCountries()
      .map((iso) => {
        const calling = `+${getCountryCallingCode(iso)}`;
        const name = displayNames.of(iso) || iso;
        const flagUrl = `https://flagcdn.com/24x18/${iso.toLowerCase()}.png`;
        return { value: iso, label: name, name, calling, flagUrl };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Preload every flag image as soon as the page loads, so they're already
  // cached by the browser by the time the country modal is opened.
  useEffect(() => {
    countryOptions.forEach((opt) => {
      const img = new Image();
      img.src = opt.flagUrl;
    });
  }, [countryOptions]);

  const handleCountrySelect = (option) => {
    if (!option) return;
    setCountryCode(option.calling);
    setCountryIso(option.value);
    setUserCountry(option.name);
    setFormData((prev) => ({ ...prev, phone: option.calling + " " }));
    setErrors((prev) => ({ ...prev, phone: "" }));
    setIsManuallySelected(true);
    setCountryModalOpen(false);
  };

  const theme = useTheme();
  const contactRef = useRef(null);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        setIsLoadingCountry(true);

        // Check if country data is already cached in this session to prevent redundant requests
        const cachedData = sessionStorage.getItem("user_country_code");
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          if (parsed.isoCode && parsed.callingCode) {
            setCountryCode(parsed.callingCode);
            setCountryIso(parsed.isoCode);
            setUserCountry(parsed.countryName || parsed.isoCode);
            setFormData((prev) => ({ ...prev, phone: "" }));
            setIsLoadingCountry(false);
            return;
          }
        }

        let callingCode = null;
        let isoCode = null;
        let countryName = null;

        try {
          const res = await fetch("https://ipwho.is/");
          if (res.ok) {
            const d = await res.json();
            if (d.success && d.country_code && d.country_phone) {
              isoCode = d.country_code;
              callingCode = d.country_phone.startsWith("+") ? d.country_phone : `+${d.country_phone}`;
              countryName = d.country;
            }
          }
        } catch { }

        if (!isoCode) {
          try {
            const res = await fetch("https://ipinfo.io/json");
            if (res.ok) {
              const d = await res.json();
              if (d.country) {
                isoCode = d.country;
                callingCode = `+${getCountryCallingCode(d.country)}`;
                const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
                countryName = displayNames.of(d.country) || d.country;
              }
            }
          } catch { }
        }

        if (isoCode && callingCode) {
          setCountryCode(callingCode);
          setCountryIso(isoCode);
          const name = countryName || isoCode;
          setUserCountry(name);
          setFormData((prev) => ({ ...prev, phone: "" }));

          sessionStorage.setItem("user_country_code", JSON.stringify({
            isoCode,
            callingCode,
            countryName: name
          }));
        } else {
          setCountryCode("+91");
          setCountryIso("IN");
          setUserCountry("India");
          setFormData((prev) => ({ ...prev, phone: "" }));
        }
      } catch {
        setCountryCode("+91");
        setCountryIso("IN");
        setUserCountry("India");
        setFormData((prev) => ({ ...prev, phone: "" }));
      } finally {
        setIsLoadingCountry(false);
      }
    };

    fetchCountryData();
  }, []);

  const handlePhoneChange = (e) => {
    const raw = e.target.value;

    if (!formData.phone && raw) {
      const digit = raw.replace(/\D/g, "");
      if (!digit) return;
      const formatter = new AsYouType(countryIso);
      const formatted = formatter.input(countryCode + digit);
      setFormData((prev) => ({ ...prev, phone: formatted }));
      return;
    }

    const localDigits = raw.replace(/\D/g, "").replace(
      new RegExp("^" + countryCode.replace("+", "")),
      ""
    );

    const internationalInput = countryCode + localDigits;
    const formatter = new AsYouType(countryIso);
    const formatted = formatter.input(internationalInput);
    const display = formatted.startsWith(countryCode) ? formatted : countryCode + " ";

    const current = parsePhoneNumberFromString(formData.phone.trim(), countryIso);
    if (current && current.isPossible() && current.isValid()) {
      if (raw.length >= formData.phone.length) return;
    }

    if (!raw || raw === "") {
      setFormData((prev) => ({ ...prev, phone: "" }));
      return;
    }

    setFormData((prev) => ({ ...prev, phone: display }));

    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      handlePhoneChange(e);
    } else if (name === "name") {
      const capitalized = value
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
      setFormData((prev) => ({ ...prev, [name]: capitalized }));
    } else if (name === "email") {
      setFormData((prev) => ({ ...prev, [name]: value.toLowerCase() }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleNameBlur = () => {
    const cleaned = (formData.name || "").replace(/\s+/g, " ").trim();
    const capitalized = cleaned
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
    setFormData((prev) => ({ ...prev, name: capitalized }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
  };

  const validatePhoneNumber = (phone) => {
    const trimmed = phone.trim();
    if (!trimmed) return "Phone number is required";

    const parsed = parsePhoneNumberFromString(trimmed, countryIso);

    if (!parsed) return "Invalid phone number";

    if (!parsed.isPossible()) {
      try {
        return `Invalid phone number for ${userCountry || "this country"}`;
      } catch {
        return "Phone number length is invalid";
      }
    }

    if (!parsed.isValid()) {
      try {
        return `Invalid phone number for ${userCountry || "this country"}`;
      } catch {
        return "Invalid phone number";
      }
    }

    return null;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = "Name can only contain letters and spaces";
    }

    if (!hidePhone) {
      const phoneError = validatePhoneNumber(formData.phone || "");
      if (phoneError) newErrors.phone = phoneError;
    }

    if (!formData.email || !formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (
      ["demo", "example", "test", "invalid", "fake", "sample", "dummy", "user"].some((w) =>
        formData.email.includes(w)
      ) ||
      !formData.email.includes("@") ||
      !formData.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+(\.[a-zA-Z]{2,})?$/) ||
      !formData.email.match(
        /\.(com|net|org|info|biz|co|me|site|online|website|store|space|io|app|dev|tech|ai|so|cloud|systems|digital|solutions|company|enterprises|agency|firm|group|international|consulting|edu|edu\.in|ac\.in|university|school|college|institute|in|co\.in|gov\.in|mil\.in|uk|us|ca|au|nz|ph|sg|id|de|fr|it|jp|tv|fm|radio|press|news|media)$/
      )
    ) {
      newErrors.email = "Please enter a valid email address";
    } else {
      const filter = new Filter();
      if (filter.isProfane(formData.email)) {
        newErrors.email = "Email contains inappropriate language";
      }
    }

    if (!formData.message || !formData.message.trim()) {
      newErrors.message = "Message cannot be empty";
    } else if (formData.message.trim().length > 500) {
      newErrors.message = "Message must be less than 500 characters";
    } else {
      const filter = new Filter();
      if (filter.isProfane(formData.message)) {
        newErrors.message = "Message contains inappropriate language";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitToGoogleSheets = async (data) => {
    try {
      const submissionData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        timestamp: new Date().toLocaleString(),
      };

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      return { success: true, message: "Message sent successfully!" };
    } catch (error) {
      console.error("Submission error:", error);
      if (import.meta.env.DEV) {
        return { success: true, message: "Development mode - submission simulated" };
      }
      throw new Error("Message submission failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isValid = validateForm();
    if (!isValid) {
      setLoading(false);
      toast.error("Please fix the errors in the form before sending.", {
        duration: 4000,
      });
      return;
    }

    const submittedData = { ...formData, hidePhone };

    const submissionPromise = submitToGoogleSheets(submittedData);
    toast.promise(submissionPromise, {
      loading: "Sending your message...",
      success: () => {
        setFormData({
          name: "",
          phone: countryCode + " ",
          email: "",
          message: "",
        });
        setHidePhone(false);
        setErrors({});
        setTimeout(() => setFeedbackOpen(true), 6000);
        return "Message sent successfully!";
      },
      error: "Failed to send message. Please try again.",
    });

    try {
      await submissionPromise;
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    setFeedbackLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setFeedbackSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleFeedbackClose = () => {
    setFeedbackOpen(false);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setRating(0);
      setFeedbackComment("");
    }, 500);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("show")),
      { threshold: 0.3 }
    );
    const el = contactRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  const getPhoneHelperText = () => {
    if (errors.phone) return errors.phone;
    if (isLoadingCountry) return "Detecting your country...";
    return (
      <span style={{ margin: '0rem' }}>
        {/* {isManuallySelected ? "Country:" : "Country:"}{" "} */}
        Country:{'  '}
        <strong>{userCountry}</strong>{" "}
        <span
          onClick={() => setCountryModalOpen(true)}
          style={{
            color: "#667eea",
            cursor: "pointer",
            fontWeight: 600,
            textDecoration: "underline",
          }}
        >
          Change
        </span>
      </span>
    );
  };

  const glassFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      background: "rgba(255,255,255,0.06)",
      backdropFilter: "blur(10px)",
      transition: "background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
      "& fieldset": { borderColor: "rgba(255,255,255,0.22)" },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.42)" },
      "&.Mui-focused fieldset": { borderColor: "#8ab4ff", borderWidth: "1.5px" },
      "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(138,180,255,0.15)" },
      "&.Mui-error fieldset": { borderColor: "#ff8a8a !important" },
    },
    "& .MuiInputBase-input": { color: "#fff" },
    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.65)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#8ab4ff" },
    "& .MuiInputLabel-root.Mui-error": { color: "#ff8a8a" },
    "& .MuiFormHelperText-root": { color: "rgba(255,255,255,0.55)" },
    "& .MuiFormHelperText-root.Mui-error": { color: "#ff8a8a" },
  };

  const glassButtonSx = {
    color: "#fff",
    background: "linear-gradient(135deg, rgba(102,126,234,0.85), rgba(118,75,162,0.85))",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.25)",
    boxShadow: "0 8px 24px rgba(102,126,234,0.35), inset 0 1px 1px rgba(255,255,255,0.4)",
    "&:hover": {
      background: "linear-gradient(135deg, rgba(102,126,234,0.95), rgba(118,75,162,0.95))",
      boxShadow: "0 10px 28px rgba(102,126,234,0.45), inset 0 1px 1px rgba(255,255,255,0.5)",
    },
  };

  return (
    <Box
      id="contact"
      className="contact-form"
      ref={contactRef}
      sx={{
        py: 8,
        px: 2,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Slide in direction="up" timeout={800}>
        <Card
          sx={{
            position: "relative",
            isolation: "isolate",
            maxWidth: 500,
            width: "100%",
            mx: "auto",
            background: `
              linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.05) 100%),
              rgba(18, 18, 28, 0.55)
            `,
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: `
              0 20px 50px rgba(0,0,0,0.45),
              inset 0 1px 1px rgba(255,255,255,0.25),
              inset 0 -8px 20px rgba(255,255,255,0.03)
            `,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
            <Fade in timeout={1000}>
              <Box>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  textAlign="center"
                  sx={{
                    background: "linear-gradient(45deg, #a3e2ff, #e8bfff)", // Swapped to higher contrast colors
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent", 
                    color: "transparent",
                    fontWeight: "bold",
                    mb: 1,
                  }}

                >
                  Get In Touch
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onBlur={handleNameBlur}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name || ""}
                    margin="normal"
                    variant="outlined"
                    size="small"
                    FormHelperTextProps={{ sx: { mx: 0.5 } }}
                    sx={glassFieldSx}
                  />

                  {!hidePhone && (
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      error={!!errors.phone}
                      margin="normal"
                      variant="outlined"
                      helperText={getPhoneHelperText()}
                      size="small"
                      inputProps={{ maxLength: 25 }}
                      FormHelperTextProps={{ sx: { mx: 0.5 } }}
                      sx={glassFieldSx}
                    />
                  )}

                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email || ""}
                    margin="normal"
                    variant="outlined"
                    size="small"
                    FormHelperTextProps={{ sx: { mx: 0.5 } }}
                    sx={glassFieldSx}
                  />

                  <TextField
                    fullWidth
                    label="Your Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    error={!!errors.message}
                    helperText={errors.message || `${formData.message.length}/500 characters`}
                    margin="normal"
                    variant="outlined"
                    multiline
                    rows={1.5}
                    size="small"
                    FormHelperTextProps={{ sx: { mx: 0.5 } }}
                    sx={{
                      ...glassFieldSx,
                      "& .MuiOutlinedInput-root": {
                        ...glassFieldSx["& .MuiOutlinedInput-root"],
                        alignItems: "flex-start",
                      },
                      "& .MuiInputBase-inputMultiline": { minHeight: "80px", color: "#fff" },
                    }}
                  />

                  <Button
                    disableRipple
                    className="contact-submit buttons"
                    type="submit"
                    variant="contained"
                    size="medium"
                    disabled={loading}
                    endIcon={loading ? <CircularProgress size={16} color="white" /> : <SendIcon />}
                    sx={{
                      ...glassButtonSx,
                      mt: 2,
                      py: 1,
                      px: 4,
                      borderRadius: 2,
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      textTransform: "none",
                      width: "100%",
                    }}
                  >
                    {loading ? "Sending" : "Send Message"}
                  </Button>
                </Box>

                {/* <Stack direction="row" spacing={1} alignItems="center" mt={2}>
                  <LockOutlinedIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Your information including your phone and email, is kept confidential.
                  </Typography>
                </Stack> */}

              </Box>
            </Fade>
          </CardContent>
        </Card>
      </Slide>

      <Dialog
        open={countryModalOpen}
        onClose={() => setCountryModalOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            minHeight: 420,
            background: "rgba(20, 20, 30, 0.75)",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            border: "1px solid rgba(255,255,255,0.16)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2)",
            color: "#fff",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", pb: 1, color: "#fff" }}>
          Select Country
          <IconButton
            onClick={() => setCountryModalOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8, color: "rgba(255,255,255,0.7)" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 0, overflow: "visible" }}>
          <ReactSelect
            autoFocus
            openMenuOnFocus
            options={countryOptions}
            onChange={handleCountrySelect}
            placeholder="Search country..."
            menuPortalTarget={document.body}
            menuPosition="fixed"
            value={countryOptions.find((o) => o.value === countryIso) || null}
            formatOptionLabel={(opt) => (
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img
                  src={opt.flagUrl}
                  alt=""
                  width={24}
                  height={18}
                  style={{ borderRadius: 2, flexShrink: 0, objectFit: "cover" }}
                  onError={(e) => { e.target.style.visibility = "hidden"; }}
                />
                <span style={{ flex: 1 }}>{opt.name}</span>
                <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#aaa" }}>{opt.calling}</span>
              </span>
            )}
            styles={{
              control: (base, state) => ({
                ...base,
                background: "rgba(255,255,255,0.06)",
                borderColor: state.isFocused ? "#8ab4ff" : "rgba(255,255,255,0.22)",
                boxShadow: state.isFocused ? "0 0 0 2px rgba(138,180,255,0.2)" : "none",
                borderRadius: 8,
                "&:hover": { borderColor: "#8ab4ff" },
              }),
              input: (base) => ({ ...base, color: "#fff" }),
              singleValue: (base) => ({ ...base, color: "#fff" }),
              placeholder: (base) => ({ ...base, color: "rgba(255,255,255,0.5)" }),
              menu: (base) => ({
                ...base,
                marginTop: 4,
                background: "rgba(28,28,38,0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.14)",
              }),
              menuList: (base) => ({ ...base, maxHeight: 300 }),
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "rgba(102,126,234,0.35)"
                  : state.isFocused
                    ? "rgba(102,126,234,0.18)"
                    : "transparent",
                color: state.isSelected ? "#cdd8ff" : "#fff",
                fontWeight: state.isSelected ? 600 : 400,
                cursor: "pointer",
              }),
            }}
          />
        </DialogContent>
      </Dialog>


      <Modal
        open={feedbackOpen}
        onClose={(event, reason) => {
          if (reason === "backdropClick") return;
          handleFeedbackClose();
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(5px)",
        }}
      >
        <Fade in={feedbackOpen}>
          <Box
            sx={{
              position: "relative",
              isolation: "isolate",
              background: "rgba(20, 20, 30, 0.75)",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: 3,
              boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2)",
              p: 4,
              width: { xs: "90%", sm: 450 },
              textAlign: "center",
              overflow: "hidden",
            }}
          >
            {!feedbackSubmitted ? (
              <>
                <IconButton
                  onClick={handleFeedbackClose}
                  sx={{ position: "absolute", right: 8, top: 8, color: "rgba(255,255,255,0.7)" }}
                >
                  <CloseIcon />
                </IconButton>

                <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5, color: "#fff" }}>
                  Rate this portfolio
                </Typography>

                <Typography variant="body2" sx={{ mb: 2, color: "rgba(255,255,255,0.6)" }}>
                  Your rating for this portfolio
                </Typography>

                <Rating
                  name="simple-controlled"
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  size="large"
                  sx={{
                    mb: 3,
                    "& .MuiRating-iconEmpty": {
                      color: "rgba(255,255,255,0.35)",
                    },
                    "& .MuiRating-iconHover": {
                      color: "#ffd54f",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Comments / Feedback"
                  multiline
                  rows={3}
                  variant="outlined"
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  sx={{ ...glassFieldSx, mb: 3 }}
                />

                <Button
                  variant="contained"
                  disableRipple
                  className="contact-submit buttons"
                  onClick={handleFeedbackSubmit}
                  disabled={!rating || feedbackLoading}
                  fullWidth
                  endIcon={feedbackLoading ? <CircularProgress size={16} color="inherit" /> : null}
                  sx={{ ...glassButtonSx, py: 1.5, fontWeight: "bold", borderRadius: 2 }}
                >
                  {feedbackLoading ? "Submitting..." : "Submit"}
                </Button>
              </>
            ) : (
              <>
                <Box sx={{ mb: 2, color: "success.main", display: "flex", justifyContent: "center" }}>
                  <GreenTickSuccess />
                </Box>

                <Typography variant="h5" fontWeight="bold" sx={{ mb: 1, color: "#fff" }}>
                  Thanks for your feedback
                </Typography>

                <Button
                  variant="contained"
                  disableRipple
                  onClick={handleFeedbackClose}
                  sx={{ ...glassButtonSx, mt: 3, px: 4, py: 1, fontWeight: "bold", borderRadius: 2 }}
                >
                  Close
                </Button>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ContactForm;