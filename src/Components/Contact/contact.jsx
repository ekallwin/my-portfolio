import React, { useState, useEffect, useRef } from "react";
import './contact.css';
import toast from 'react-hot-toast';
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
} from "@mui/material";
import Stack from "@mui/material/Stack";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Send as SendIcon, Close as CloseIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import GreenTickSuccess from "./Component/Success";
import moment from "moment";

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
  const [isLoadingCountry, setIsLoadingCountry] = useState(true);
  const [isIndia, setIsIndia] = useState(false);
  const [userCountry, setUserCountry] = useState("");
  const [isp, setIsp] = useState("");

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const theme = useTheme();
  const contactRef = useRef(null);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        setIsLoadingCountry(true);

        const response = await fetch("https://ipwho.is/");
        const data = await response.json();

        if (data.success) {
          const userCallingCode = `+${data.calling_code}`;
          const userCountryName = data.country;
          const isUserInIndia = data.country_code === "IN";
          const userISP = data.connection?.isp || "Anonymous ISP";

          setCountryCode(userCallingCode);
          setUserCountry(userCountryName);
          setIsIndia(isUserInIndia);
          setIsp(userISP);

          if (!formData.phone) {
            if (isUserInIndia) {
              setFormData((prev) => ({
                ...prev,
                phone: "+91 ",
              }));
            } else {
              setFormData((prev) => ({
                ...prev,
                phone: userCallingCode + " ",
              }));
            }
          }
        }
      } catch (error) {
        console.log("Could not fetch country data, using default +91");
        setCountryCode("+91");
        setIsIndia(true);
        setUserCountry("India");
        if (!formData.phone) {
          setFormData((prev) => ({ ...prev, phone: "+91 " }));
        }
      } finally {
        setIsLoadingCountry(false);
      }
    };

    fetchCountryData();
  }, []);

  const handlePhoneChange = (e) => {
    const value = e.target.value;

    if (isIndia) {
      const cleanedValue = value.replace(/\D/g, "");
      let formattedValue = cleanedValue;
      if (!cleanedValue.startsWith("91") && cleanedValue) {
        formattedValue = "91" + cleanedValue;
      }

      if (formattedValue.length > 12) {
        return;
      }

      let displayValue = "+91 ";
      const localNumber = formattedValue.slice(2);

      if (localNumber.length > 0) {
        if (localNumber.length <= 5) {
          displayValue += localNumber;
        } else {
          displayValue += localNumber.slice(0, 5) + " " + localNumber.slice(5, 10);
        }
      }

      setFormData((prev) => ({
        ...prev,
        phone: displayValue,
      }));
    } else {
      let formattedValue = value;

      if (!value.startsWith("+") && value) {
        formattedValue = countryCode + " " + value.replace(/\D/g, "");
      }

      formattedValue = formattedValue.replace(/[^\d+\s]/g, "");

      let displayValue = formattedValue;
      if (formattedValue.startsWith("+") && !formattedValue.includes(" ") && formattedValue.length > 3) {
        const codeMatch = formattedValue.match(/^(\+\d{1,4})(\d+)/);
        if (codeMatch) {
          displayValue = codeMatch[1] + " " + codeMatch[2];
        }
      }

      setFormData((prev) => ({
        ...prev,
        phone: displayValue,
      }));
    }

    if (errors.phone) {
      setErrors((prev) => ({
        ...prev,
        phone: "",
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      handlePhoneChange(e);
    } else if (name === "name") {
      const capitalizedValue = value
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

      setFormData((prev) => ({
        ...prev,
        [name]: capitalizedValue,
      }));

    } else if (name === "email") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.toLowerCase(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleNameBlur = () => {
    const raw = formData.name || "";
    const cleaned = raw.replace(/\s+/g, " ").trim();

    const capitalized = cleaned
      .split(" ")
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    setFormData(prev => ({ ...prev, name: capitalized }));
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: "" }));
    }
  };


  const validatePhoneNumber = (phone) => {
    const cleanPhone = phone.replace(/\s/g, "");

    if (isIndia) {
      if (!cleanPhone.startsWith("+91")) {
        return "Indian numbers must start with +91";
      }

      const localNumber = cleanPhone.slice(3);

      if (localNumber.length !== 10) {
        return "Indian phone number must be 10 digits";
      }

      const firstDigit = localNumber.charAt(0);
      if (!["6", "7", "8", "9"].includes(firstDigit)) {
        return "Invalid Indian phone number";
      }

      if (!/^\d+$/.test(localNumber)) {
        return "Phone number must contain only digits";
      }
    } else {
      if (!cleanPhone.startsWith("+")) {
        return "Phone number must start with country code";
      }

      const countryCodeMatch = cleanPhone.match(/^\+(\d{1,4})/);
      if (!countryCodeMatch) {
        return "Invalid country code format";
      }

      const localNumber = cleanPhone.slice(countryCodeMatch[0].length);

      if (localNumber.length < 5) {
        return "Phone number is too short";
      }

      if (localNumber.length > 15) {
        return "Phone number is too long";
      }

      if (!/^\d+$/.test(localNumber)) {
        return "Phone number must contain only digits after country code";
      }
    }

    return null;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || !formData.name.trim()) {
      toast.error("Name is required");
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters long");
      newErrors.name = "Name must be at least 2 characters long";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      toast.error("Name can only contain letters and spaces");
      newErrors.name = "Name can only contain letters and spaces";
    }

    if (!hidePhone) {
      if (!formData.phone || !formData.phone.trim()) {
        toast.error("Phone number is required");
        newErrors.phone = "Phone number is required";
      } else {
        const phoneError = validatePhoneNumber(formData.phone);
        if (phoneError) {
          toast.error(phoneError);
          newErrors.phone = phoneError;
        }
      }
    }

    if (!formData.email || !formData.email.trim()) {
      toast.error("Email address is required");
      newErrors.email = "Email address is required";
    } else if (
      ["demo", "example", "test", "invalid", "fake", "sample", "dummy", "user"].some(word =>
        formData.email.includes(word)
      ) ||
      !formData.email.includes("@") ||
      !formData.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+(\.[a-zA-Z]{2,})?$/) ||
      !formData.email.match(
        /\.(com|net|org|info|biz|co|me|site|online|website|store|space|io|app|dev|tech|ai|so|cloud|systems|digital|solutions|company|enterprises|agency|firm|group|international|consulting|edu|edu\.in|ac\.in|university|school|college|institute|in|co\.in|gov\.in|mil\.in|uk|us|ca|au|nz|ph|sg|id|de|fr|it|jp|tv|fm|radio|press|news|media)$/
      )
    ) {
      toast.error("Please enter a valid email address");
      newErrors.email = "Please enter a valid email address";
    } else {
      const filter = new Filter();
      if (filter.isProfane(formData.email)) {
        toast.error("Email contains inappropriate language");
        newErrors.email = "Email contains inappropriate language";
      }
    }

    if (!formData.message || !formData.message.trim()) {
      toast.error("Message cannot be empty");
      newErrors.message = "Message cannot be empty";
    } else if (formData.message.length > 500) {
      toast.error("Message must be less than 500 characters");
      newErrors.message = "Message must be less than 500 characters";
    } else {
      const filter = new Filter();
      if (filter.isProfane(formData.message)) {
        toast.error("Message contains inappropriate language");
        newErrors.message = "Message contains inappropriate language";
      }
    }

    setErrors({});

    return Object.keys(newErrors).length === 0;
  };

  const submitToGoogleSheets = async (data) => {
    try {
      const submissionData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        timestamp: new Date().toLocaleString()
      };

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      return { success: true, message: 'Message sent successfully!' };

    } catch (error) {
      console.error('Submission error:', error);

      if (import.meta.env.DEV) {
        console.warn('Development mode: Simulating success');
        return { success: true, message: 'Development mode - submission simulated' };
      }

      throw new Error(`Message submission failed. Please try again.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isValid = validateForm();
    if (!isValid) {
      setLoading(false);
      Object.values(errors).forEach(error => {
        if (error) toast.error(error);
      });
      return;
    }

    const submittedData = { ...formData, hidePhone };

    const submissionPromise = submitToGoogleSheets(submittedData);
    toast.promise(submissionPromise, {
      loading: 'Sending your message...',
      success: (data) => {
        setFormData({
          name: "",
          phone: isIndia ? "+91 " : `${countryCode} `,
          email: "",
          message: "",
        });
        setHidePhone(false);
        setErrors({});

        setTimeout(() => {
          setFeedbackOpen(true);
        }, 1500);

        return `Message sent successfully!`;
      },
      error: 'Failed to send message. Please try again.',
    });

    try {
      await submissionPromise;
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = () => {
    setFeedbackSubmitted(true);
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
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.3 }
    );

    const contactElement = contactRef.current;
    if (contactElement) {
      observer.observe(contactElement);
    }

    return () => {
      if (contactElement) {
        observer.unobserve(contactElement);
      }
    };
  }, []);

  const getPhoneHelperText = () => {
    if (errors.phone) return errors.phone;

    if (isLoadingCountry) {
      return "Detecting your country...";
    }

    if (isIndia) {
      return `Detected country: ${countryCode} - ${userCountry}`;
    }

    return `Detected country: ${countryCode} - ${userCountry}`;
  };

  const getPhoneMaxLength = () => {
    if (isIndia) {
      return 15;
    }
    return 25;
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
            maxWidth: 500,
            width: "100%",
            mx: "auto",
            background: "rgba(255, 255, 255, 0.93)",
            backdropFilter: "blur(20px)",
            borderRadius: 4,
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Fade in timeout={1000}>
              <Box>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  textAlign="center"
                  sx={{
                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
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
                    margin="normal"
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,

                      },
                    }}
                  />

                  {/* <FormControlLabel
                    control={
                      <Checkbox
                        checked={hidePhone}
                        onChange={(e) => setHidePhone(e.target.checked)}
                        color="primary"
                        size="small"
                      />
                    }
                    label="Don't share phone number"
                    sx={{ mt: 1, mb: 1 }}
                  /> */}

                  {!hidePhone && (
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      value={formData.phone}
                      onChange={handleChange}
                      error={!!errors.phone}
                      margin="normal"
                      variant="outlined"
                      helperText={getPhoneHelperText()}
                      size="small"
                      inputProps={{
                        maxLength: getPhoneMaxLength(),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                      placeholder={isIndia ? "+91 98765 43210" : `${countryCode} 123 456 7890`}
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
                    margin="normal"
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Your Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    error={!!errors.message}
                    helperText={`${formData.message.length}/500 characters`}
                    margin="normal"
                    variant="outlined"
                    multiline
                    rows={1.5}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        alignItems: "flex-start",
                      },
                      "& .MuiInputBase-inputMultiline": {
                        minHeight: "80px",
                      },
                    }}
                  />

                  <Button
                    disableRipple
                    className="contact-submit"
                    type="submit"
                    variant="contained"
                    size="medium"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="white" /> : <SendIcon />}
                    sx={{
                      mt: 2,
                      py: 1,
                      px: 4,
                      borderRadius: 2,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      textTransform: "none",
                      width: "100%",
                    }}
                  >
                    {loading ? "Sending" : "Send Message"}
                  </Button>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center" mt={2}>
                  <LockOutlinedIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Your information including your phone and email, is kept confidential.
                  </Typography>
                </Stack>
              </Box>
            </Fade>
          </CardContent>
        </Card>
      </Slide>

      <Modal
        open={feedbackOpen}
        onClose={(event, reason) => {
          if (reason === "backdropClick") return;
          handleFeedbackClose();
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(5px)',
        }}
      >
        <Fade in={feedbackOpen}>
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
              width: { xs: "90%", sm: 450 },
              position: 'relative',
              textAlign: "center",
            }}
          >
            {!feedbackSubmitted ? (
              <>
                <IconButton
                  onClick={handleFeedbackClose}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'text.secondary',
                  }}
                >
                  <CloseIcon />
                </IconButton>

                <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5, color: 'text.primary' }}>
                  Rate this portfolio
                </Typography>

                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Your rating for this portfolio
                </Typography>

                <Rating
                  name="simple-controlled"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                  size="large"
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  label="Commands / Feedback"
                  multiline
                  rows={3}
                  variant="outlined"
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  sx={{ mb: 3 }}
                />

                <Button
                  variant="contained"
                  disableRipple
                  onClick={handleFeedbackSubmit}
                  disabled={!rating}
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontWeight: "bold",
                    borderRadius: 2,
                  }}
                >

                  Submit
                </Button>
              </>
            ) : (
              <>
                <Box sx={{ mb: 2, color: 'success.main', display: 'flex', justifyContent: 'center' }}>
                  <GreenTickSuccess />
                </Box>

                <Typography variant="h5" fontWeight="bold" sx={{ mb: 1, color: 'text.primary' }}>
                  Thanks for your feedback
                </Typography>

                <Button
                  variant="contained"
                  disableRipple
                  onClick={handleFeedbackClose}
                  sx={{
                    mt: 3,
                    px: 4,
                    py: 1,
                    fontWeight: "bold",
                    borderRadius: 2,
                  }}
                >
                  Close
                </Button>
              </>
            )}
          </Box>
        </Fade>
      </Modal>

    </Box >
  );
};

export default ContactForm;