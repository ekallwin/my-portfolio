import React, { useState, useEffect, useRef } from "react";
// import { toast } from "react-notifications";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import "./contact.css";
import "./contactres.css";
import emailjs from "@emailjs/browser";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Filter } from 'bad-words';
import moment from 'moment-timezone';
import { displayName } from "react-world-flags";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    countryCode: "in",
  });
  const [phoneLength, setPhoneLength] = useState(10);
  const [hidePhone, setHidePhone] = useState(false);

  const contactRef = useRef(null);

  const handlePhoneChange = (phone, country) => {
    let expectedLength = 10;
    if (country && country.format) {
      expectedLength = country.format.replace(/[^.#]/g, "").length;
    }

    setPhoneLength(expectedLength);
    setFormData((prev) => ({ ...prev, phone: phone.startsWith("+") ? phone : "" + phone }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "name"
        ? value
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase())
        : name === "email"
          ? value
            .toLowerCase()
          : name === "message"
            ? value
              .toLowerCase()
              .replace(/(^\s*\w|[.!?]\s*\w)/g, (char) => char.toUpperCase())
            : value
    });
  };

  const validate = () => {
    let isValid = true;

    const nameRegex = /^[a-zA-Z\s]+$/;
    const consecutiveIdenticalRegex = /([a-zA-Z])\1{2,}/i;

    function hasAlphabeticalSequence(str, sequenceLength = 6) {
      const input = str.toLowerCase().replace(/\s+/g, '');
      for (let i = 0; i <= input.length - sequenceLength; i++) {
        let match = true;
        for (let j = 1; j < sequenceLength; j++) {
          if (input.charCodeAt(i + j) !== input.charCodeAt(i + j - 1) + 1) {
            match = false;
            break;
          }
        }
        if (match) return true;
      }
      return false;
    }

    if (!formData.name.trim()) {
      toast.error("Name is required", null, 4000);
      isValid = false;
    } else if (formData.name.trim().length < 1) {
      toast.error(`Invalid name "${formData.name.trim()}"`, null, 4000);
      isValid = false;
    } else if (formData.name.trim().length > 50) {
      toast.error(`Invalid name`, null, 4000);
      isValid = false;
    } else if (!nameRegex.test(formData.name)) {
      toast.error(`Invalid name "${formData.name.trim()}"`, null, 4000);
      isValid = false;
    } else if (consecutiveIdenticalRegex.test(formData.name.replace(/\s+/g, ''))) {
      toast.error(`Invalid name "${formData.name.trim()}"`, null, 4000);
      isValid = false;
    } else if (hasAlphabeticalSequence(formData.name)) {
      toast.error(`Invalid name "${formData.name.trim()}"`, null, 4000);
      isValid = false;
    }

    if (!hidePhone) {
      const cleanedPhone = formData.phone.replace(/\D/g, "");

      if (!cleanedPhone) {
        toast.error("Phone number is required", null, 4000);
        isValid = false;
      } else if (cleanedPhone.length < phoneLength) {
        toast.error("Invalid Phone Number", null, 4000);
        isValid = false;
      } else if (cleanedPhone.length !== phoneLength) {
        toast.error("Invalid Phone Number", null, 4000);
        isValid = false;
      }
    }

    if (!formData.email.trim()) {
      toast.error("Email address is required", null, 4000);
      isValid = false;
    } else if (
      !formData.email.includes("@") ||
      !formData.email.match(/^[a-zA-Z0-9.-_]+@[a-zA-Z0-9]+(\.[a-zA-Z]{2,})?$/) ||
      !formData.email.match(/\.(com|net|org|info|biz|co|me|site|online|website|store|space|io|app|dev|tech|ai|so|cloud|systems|digital|solutions|company|enterprises|agency|firm|group|international|consulting|edu|edu\.in|ac\.in|university|school|college|institute|in|co\.in|gov\.in|mil\.in|uk|us|ca|au|nz|ph|sg|id|de|fr|it|jp|tv|fm|radio|press|news|media)$/)
    ) {
      toast.error("Invalid email address", null, 4000);
      isValid = false;
    }

    if (!formData.message.trim()) {
      toast.error("Message cannot be empty", null, 4000);
      isValid = false;
    } else if (formData.message.length > 500) {
      toast.error("Message cannot be more than 500 characters long", null, 4000);
      isValid = false;
    }
    else {
      const filter = new Filter();
      if (filter.isProfane(formData.message)) {
        toast.error("Message contains inappropriate language", null, 4000);
        isValid = false;
      }
      const messageRegex = /^[a-zA-Z0-9.,'"!&\s@%#%^*(){}?+-/]*$/;
      if (!messageRegex.test(formData.message)) {
        toast.error("Message can only contain alphabets, numbers, and some special symbols", null, 4000);
        isValid = false;
      }
    }

    return isValid;
  };

  const notify = () => {
    const toastId = toast.loading("Sending your message... Please don't close this page", {
    });

    setTimeout(() => {
      toast.update(toastId, {
        render: "Your message has been sent successfully! You will receive Email confirmation shortly. Don't forgot to check the spam folder",
        type: "success",
        isLoading: false,
        autoClose: 9000,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        closeButton: true,
      });
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const templateIDAdmin = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ADMIN;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      const templateParams = {
        name: formData.name,
        user_email: formData.email,
        maskedphone: hidePhone
          ? "Not Available"
          : (() => {
            const raw = formData.phone.startsWith('+') ? formData.phone : `+${formData.phone}`;
            const match = raw.match(/^(\+\d{1,4})(\d+)?$/);
            if (!match) return raw;
            const countryCode = match[1];
            const localNumber = match[2] || '';
            const last4 = localNumber.slice(-3);
            const maskedSection = '*'.repeat(localNumber.length - 4);
            return `${countryCode}${maskedSection}${last4}`;
          })(),

        maskedemail: (() => {
          const email = formData.email.trim();
          const atIndex = email.indexOf('@');

          if (atIndex <= 4) return email;

          const username = email.slice(0, atIndex);
          const domain = email.slice(atIndex);

          const firstTwo = username.slice(0, 2);
          const lastTwo = username.slice(-2);

          const starsCount = Math.max(username.length - 4, 1);
          const stars = '*'.repeat(starsCount);

          const safeDomain = domain
            .replace('@', '\u200B@')
            .replace(/\./g, '\u200B.');

          return `${firstTwo}${stars}${lastTwo}${safeDomain}`;
        })(),



        message: formData.message,
        timestamp: moment().add(2, 'seconds').format('DD-MM-YYYY [at] hh:mm:ss A'),
      };

      const templateParamsAdmin = {
        name: formData.name,
        phone: hidePhone ? "Hidden by user" : formData.phone.startsWith('+') ? formData.phone : `+${formData.phone}`,
        whatsapp: hidePhone ? "Hidden by user" : (formData.phone.startsWith('+') ? formData.phone.slice(1) : formData.phone),
        email: formData.email,
        message: formData.message,
        timestamp: moment().add(2, 'seconds').format('DD-MM-YYYY [at] hh:mm:ss A'),
      };

      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
      setHidePhone(false);
      notify();
      Promise.all([
        emailjs.send(serviceID, templateID, templateParams, publicKey),
        emailjs.send(serviceID, templateIDAdmin, templateParamsAdmin, publicKey)
      ])
        .catch((error) => {
          console.error("Email sending failed:", error);
          toast.error("Failed to send message. Try again later.");
        });

    }
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

  useEffect(() => {
    const updateDropdownWidth = () => {
      const phoneInput = document.querySelector('.react-tel-input');
      const dropdown = document.querySelector('.country-list');

      if (phoneInput && dropdown) {
        const viewportWidth = window.innerWidth;
        const baseWidth = phoneInput.offsetWidth;

        const ratio = 0.95 + (600 - Math.min(600, viewportWidth)) * 0.0005;

        dropdown.style.width = `${baseWidth * ratio}px`;
      }
    };

    updateDropdownWidth();

    const resizeObserver = new ResizeObserver(updateDropdownWidth);
    resizeObserver.observe(document.body);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="contact" id="Contact">
      <h2>Contact me</h2>
      <form onSubmit={handleSubmit} className="fade-in-contact" ref={contactRef} autoComplete="off">
        <div className="input-container">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="" pattern="[A-Za-z\s]*" onInput={(e) => { e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ""); }} style={{ width: "100%" }} autoComplete="off" />
          <label className="label">Name</label>
        </div>

        <div className="checkbox-container">
          <input
            type="checkbox"
            id="hidePhone"
            className="form-check-input"
            checked={hidePhone}
            onChange={(e) => setHidePhone(e.target.checked)}
          />
          <label htmlFor="hidePhone" className="form-check-label" style={{ marginLeft: '10px' }}>Hide phone number</label>
        </div>

        {!hidePhone && (
          <div className="input-container phone-input-wrapper">
            <PhoneInput
              country={"in"}
              value={formData.phone}
              onChange={handlePhoneChange}
              inputClass="phone-input"
              buttonClass="phone-dropdown-button"
              dropdownClass="phone-dropdown"
              enableSearch={true}
              autoComplete="off"
            />
          </div>
        )}

        <div className="input-container" style={{ marginTop: "20px" }}>
          <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder=" " autoComplete="off" style={{ width: "100%" }} />
          <label className="label">Email Address</label>
        </div>
        <div className="input-container">
          <textarea type="text" name="message" value={formData.message} maxLength={501} onChange={handleChange} placeholder=" " style={{ width: "100%", resize: 'none' }} autoComplete="off" />
          <label className="label">Your Message</label>
          <div className={formData.message.length > 490 ? "char-count-max" : "char-count"}>
            {formData.message.length > 490
              ? `${Math.max(0, 500 - formData.message.length)} characters left`
              : `${formData.message.length}/500`}
          </div>
        </div>
        <button type="submit" className="submit">Send <FontAwesomeIcon icon={faPaperPlane} /></button>
      </form>
    </div>
  );
};

export default ContactForm;