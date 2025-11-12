import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import profileData from "./profileData.json";
import "./ChatBot.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPaperPlane, faRobot } from "@fortawesome/free-solid-svg-icons";
import emailjs from "@emailjs/browser";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Filter } from "bad-words";
import moment from "moment";

export default function ChatBot() {
    const navigate = useNavigate();
    const chatbotRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(true);
    const [conversationStep, setConversationStep] = useState(0);
    const [formattedName, setFormattedName] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [phoneLength, setPhoneLength] = useState(10);

    const handlePhoneChange = (phone, country) => {
        let expectedLength = 10;
        if (country && country.format) {
            expectedLength = country.format.replace(/[^.#]/g, "").length;
        }

        setPhoneLength(expectedLength);
        setInput(phone)
        setFormData((prev) => ({
            ...prev,
            phone: phone.startsWith("+") ? phone : "+" + phone
        }));
    };


    const messagesEndRef = useRef(null);

    const [showComponent, setShowComponent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowComponent(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const restartChat = () => {
        const currentHour = moment().hour();

        let greeting = '';
        if (currentHour >= 0 && currentHour < 12) {
            greeting = 'Morning';
        } else if (currentHour >= 12 && currentHour < 15) {
            greeting = 'Afternoon';
        } else {
            greeting = 'Evening';
        }
        setMessages([]);
        setIsTyping(true);
        setConversationStep(0);
        setTimeout(() => {
            setMessages([{ sender: "bot", text: `Good ${greeting}! How can I assist you today? Just ask me I'm always happy to help!`, showButtons: true }]);
            setIsTyping(false);
        }, 2000);
    };


    const sendContactForm = useCallback(() => {
        const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const templateIDAdmin = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ADMIN;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        const templateParams = {
            name: formData.name,
            user_email: formData.email,
            maskedphone: (() => {
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
            phone: formData.phone.startsWith('+') ? formData.phone : `+${formData.phone}`,
            email: formData.email,
            message: formData.message,
            timestamp: moment().add(2, 'seconds').format('DD-MM-YYYY [at] hh:mm:ss A'),
        };

        Promise.all([
            emailjs.send(serviceID, templateID, templateParams, publicKey),
            emailjs.send(serviceID, templateIDAdmin, templateParamsAdmin, publicKey)
        ])
            .then(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: "bot",
                        text: `${formattedName}, Your message has been sent successfully! You will receive an email confirmation shortly!`
                    }
                ]);
            })


            .catch(() => {
                setMessages((prev) => [...prev, { sender: "bot", text: "There was an issue sending your message. Try again later" }]);
            });
    }, [formattedName, formData]);

    const [hasSentEmail, setHasSentEmail] = useState(false);
    useEffect(() => {
        if (conversationStep === 5 && formData.message && !hasSentEmail) {
            sendContactForm();
            setHasSentEmail(true);
        }
    }, [conversationStep, formData.message, hasSentEmail, sendContactForm]);

    const toggleChat = () => {
        setIsOpen((prev) => {
            const newState = !prev;

            if (newState && messages.length === 0) {
                const currentHour = moment().hour();
                let greeting = '';
                if (currentHour >= 0 && currentHour < 12) {
                    greeting = 'Morning';
                } else if (currentHour >= 12 && currentHour < 16) {
                    greeting = 'Afternoon';
                } else {
                    greeting = 'Evening';
                }

                setTimeout(() => {
                    setMessages([{
                        sender: "bot",
                        text: `Good ${greeting}! How can I assist you today? Just ask me I'm always happy to help!`,
                        showButtons: true
                    }]);
                    setIsTyping(false);
                }, 1500);
            }

            return newState;
        });
    };

    const filter = new Filter();
    const positiveWords = [
        "good", "great", "awesome", "excellent", "fantastic", "amazing", "nice",
        "wonderful", "superb", "outstanding", "love", "cool", "perfect", "best",
        "impressive", "brilliant", "spectacular", "super", "happy", "smile",
        "joy", "positive", "optimistic", "charming", "enthusiastic", "delightful",
        "radiant", "cheerful", "kind", "supportive", "grateful", "thankful",
        "beautiful", "sweet", "peaceful", "successful", "genius", "incredible",
        "fun", "friendly", "motivating", "uplifting", "encouraging", "energetic",
        "lively", "strong", "smart", "intelligent", "talented", "lovely",
        "passionate", "respectful", "honest", "loyal", "inspiring", "warm-hearted",
        "blessed", "fortunate", "appreciated", "celebrated", "victorious", "kk", "done", "well done",
        "good work", "good job", "good effort", "good luck", "good wishes", "good vibes",
        "nice portfolio", "good portfolio", "good website", "good blog", "good content", "awesome", "awsome"
    ];

    const negativeWords = [
        "bad", "worst", "awful", "terrible", "horrible", "poor", "disgusting",
        "hate", "upset", "sad", "angry", "frustrated", "annoying", "disappointing",
        "boring", "dumb", "stupid", "nonsense", "idiot", "miserable", "pathetic",
        "foolish", "dissatisfied", "ugly", "ridiculous", "offensive", "painful",
        "horrendous", "crap", "waste", "hopeless", "useless", "failure", "hurtful",
        "regret", "sick", "tired", "ashamed", "gloomy", "depressing", "depressed",
        "pointless", "horrid", "hateful", "shameful", "abysmal", "appalling",
        "inferior", "insulting", "loathsome", "lousy", "mediocre", "miserable",
        "offensive", "pathetic", "repulsive", "scornful", "troublesome",
        "vile", "wicked", "wretched", "nasty", "heartbreaking", "despair",
        "incompetent", "regretful", "unhappy", "undesirable", "unfair",
        "unforgivable", "unpleasant", "unworthy", "worthless", "nothing", "devastating", "no thanks"
    ];

    const socialMediaWords = [
        "facebook", "fb", "instagram", "insta", "twitter", "x", "linkedin",
        "threads", "social media", "github", "git", "snapchat", "sc", "tiktok",
        "reddit", "discord", "telegram", "whatsapp", "yt", "youtube", "pinterest",
        "social medias", "social"
    ];

    const contactWords = [
        "contact", "message", "reach", "call", "email", "phone", "support",
        "help", "assistance", "enquiry", "inquiry", "chat", "talk", "speak",
        "customer service", "helpdesk", "request", "details", "query"
    ];

    const greetings = [
        "hi", "hello", "hey", "hii", "greetings"
    ];
    const achievementKeywords = [
        "achievement", "award", "symposium", "event"
    ];
    const nameKeywords = [
        "name", "made", "creator"
    ]
    const aboutKeywords = [
        "about", "info"
    ]
    const educationKeywords = [
        "education", "learn", "study", "university", "college"
    ]
    const endConversationKeywords = [
        "no", "nope", "nah", "nothing", "not now", "i'm done", "done", "stop", "quit",
        "from now", "that's all", "that's enough", "no thanks", "no thank you",
        "maybe later", "leave me", "not interested", "i'm good", "i'm okay",
        "enough", "i have no more questions", "no more questions", "end", "that's it"
    ];
    const yesWords = [
        "yes", "yeah", "yep", "sure", "absolutely", "of course", "definitely",
        "indeed", "ok", "okay", "yup", "please do", "go ahead", "certainly",
        "affirmative", "sounds good", "fine", "alright", "gladly", "i do", "i would"
    ];

    const getBotResponse = (query) => {

        const lowerCaseQuery = query.toLowerCase();
        if (socialMediaWords.some(word => lowerCaseQuery.includes(word))) {
            return {
                text: "Here are the social media links:",
                showSocialButtons: true,
            };
        }
        if (achievementKeywords.some(word => lowerCaseQuery.includes(word))) {
            return {
                text: "Here are the achievements",
                showAchievementButton: true
            };
        }
        if (nameKeywords.some(word => lowerCaseQuery.includes(word))) {
            return `My creator's name is ${profileData.name}`
        }
        if (aboutKeywords.some(word => lowerCaseQuery.includes(word))) {
            return `${profileData.about}`
        }
        if (educationKeywords.some(word => lowerCaseQuery.includes(word))) {
            return `${profileData.name} is currently studying at ${profileData.college}`
        }
        if (conversationStep <= 0) {

            if (filter.isProfane(lowerCaseQuery)) {
                return "This message may contain language that could be considered inappropriate or sensitive. I can't help you with this";
            }

            if (!/^[a-zA-Z0-9\s.,!?'\-+*/\\^%$#@&=<>{}[\]()_|~`]+$/.test(query)) {
                return "Currently, I only know English";
            }

            if (greetings.some(word => lowerCaseQuery.includes(word))) {
                return "Hello! How can I assist you today? Just ask me, I'm always happy to help!";
            }
            if (yesWords.some(word => lowerCaseQuery.includes(word))) {
                return "Great! Let me know how I can assist you further.";
            }

            if (positiveWords.some(word => lowerCaseQuery.includes(word))) {
                return "Glad to hear that! It was nice talking to you. If you have any questions, feel free to ask!";
            }
            if (negativeWords.some(word => lowerCaseQuery.includes(word))) {
                return "Sorry to hear that! I'm constantly improving myself and I'm still learning. If you have any questions, feel free to ask!";
            }
            if (endConversationKeywords.some(word => lowerCaseQuery.includes(word))) {
                return "No problem, If you have any other issues, feel free to ask me!";
            }

            if (contactWords.some(word => lowerCaseQuery.includes(word))) {
                setConversationStep(1);
                return "Sure! Please provide your Name";
            }
        }
        if (conversationStep === 0) {
            if (lowerCaseQuery.includes("skills")) return `Here are some skills: ${profileData.skills.join(", ")}`;
            if (lowerCaseQuery.includes("projects")) return `Projects build by Allwin are: \n \n${profileData.projects.join(", \n")}`;

            if (socialMediaWords.some(word => lowerCaseQuery.includes(word))) {
                return {
                    text: "Here are the social media links:",
                    showSocialButtons: true,
                };
            }

        }

        if (conversationStep === 1) {
            if (filter.isProfane(query)) {
                return "Your name seems to contain inappropriate language. Please enter a valid name";
            }
            if (negativeWords.some(word => lowerCaseQuery.includes(word))) {
                return "I think you have entered a wrong name. Please enter a valid name";
            }
            if (socialMediaWords.some(word => lowerCaseQuery.includes(word))) {
                return "You meant Social media? If you wish to know my social media links, you can ask me after providing your contact details";
            }
            if (!/^[a-zA-Z\s]{1,}$/.test(query)) {
                return "Oops! That doesn't look like a valid name";
            }
            if (!/^[a-zA-Z\s]{1,50}$/.test(query)) {
                return "Oops! That doesn't look like a long name";
            }

            const cleanedQuery = query.replace(/\s+/g, '');
            function hasAlphabeticalSequence(name) {
                const lower = name.toLowerCase().replace(/[^a-z]/g, '');
                for (let i = 0; i <= lower.length - 5; i++) {
                    let isSequential = true;
                    for (let j = 0; j < 3; j++) {
                        if (lower.charCodeAt(i + j + 1) !== lower.charCodeAt(i + j) + 1) {
                            isSequential = false;
                            break;
                        }
                    }
                    if (isSequential) return true;
                }
                return false;
            }

            if (/([a-zA-Z])\1{2,}/.test(cleanedQuery)) {
                return "Looks like your name is invalid. Can you double-check it?";
            }

            if (hasAlphabeticalSequence(cleanedQuery)) {
                return "Looks like your name is invalid. Please enter your real name.";
            }


            const formatted = query
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ");

            setFormattedName(formatted);
            setFormData({ ...formData, name: formatted });
            setConversationStep(2);
            return `Alright, ${formatted}! Please enter your email address. Make sure it's real and that you're active on it.`;
        }


        if (conversationStep === 2) {
            const lowerCaseEmail = query.toLowerCase();
            if (filter.isProfane(query)) {
                return "The email you entered contains inappropriate language. Please enter a valid email address";
            }
            if (
                !lowerCaseEmail.includes("@") ||
                !lowerCaseEmail.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) ||
                !lowerCaseEmail.match(/\.(com|net|org|info|biz|co|me|site|online|website|store|space|io|app|dev|tech|ai|so|cloud|systems|digital|solutions|company|enterprises|agency|firm|group|international|consulting|edu|edu\.in|ac\.in|university|school|college|institute|in|co\.in|gov\.in|mil\.in|uk|us|ca|au|nz|ph|sg|id|de|fr|it|jp|tv|fm|radio|press|news|media)$/)
            ) {
                return "Invalid email address. Please enter a valid email (e.g., example@domain.com)";
            }
            setFormData({ ...formData, email: lowerCaseEmail });
            setConversationStep(3);
            return `Thank you, ${formattedName}! Please enter your phone number. This will be used to contact you, so ensure it’s accurate.`;
        }

        if (conversationStep === 3) {
            const cleanedPhone = query.replace(/\D/g, "");

            if (socialMediaWords.some(word => lowerCaseQuery.includes(word))) {
                return "You meant Social media? If you wish to know my social media links, you can ask me after providing your contact details";
            }
            if (cleanedPhone.length !== phoneLength) {
                return `Invalid phone number length. Expected ${phoneLength} digits`;
            }

            setFormData({ ...formData, phone: query });
            setConversationStep(4);
            return `${formattedName}, Now type your message below to send it to Allwin.`;
        }

        if (conversationStep === 4) {
            if (filter.isProfane(query)) {
                return "Your message contains inappropriate language. Please rephrase it politely";
            }
            setFormData((prevFormData) => ({
                ...prevFormData,
                message: query,
            }));
            setConversationStep(5);
            return "Sending your message... Please don't close this chat";
        }
        if (conversationStep === 5) {
            setConversationStep(0);
            if (greetings.some(word => lowerCaseQuery.includes(word))) {
                return "Hello again! How can I assist you further?";
            }
            if (positiveWords.some(word => lowerCaseQuery.includes(word))) {
                return "You're welcome! Let me know if you need anything else.";
            }
            if (negativeWords.some(word => lowerCaseQuery.includes(word))) {
                return "Sorry to hear that! I'm constantly improving myself and I'm still learning. If you have any questions, feel free to ask!";
            }
            if (endConversationKeywords.some(word => lowerCaseQuery.includes(word))) {
                return "No problem, If you have any other issues, feel free to ask me!";
            }
            if (yesWords.some(word => lowerCaseQuery.includes(word))) {
                return "Great! Let me know how I can assist you further.";
            }
            return {
                text: "I'm still here if you have more questions",
                showButtons: true
            };
        }

        return "I'm not sure, but I'm learning!";
    };

    const sendMessage = () => {
        if (input.trim() === "") return;
        const userMessage = { sender: "user", text: input };
        setMessages([...messages, userMessage]);
        setInput("");
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const botResponse = getBotResponse(input);

            if (typeof botResponse === "string") {
                setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
            } else {
                setMessages((prev) => [...prev, { sender: "bot", text: botResponse.text, showSocialButtons: botResponse.showSocialButtons, showAchievementButton: botResponse.showAchievementButton }]);
            }

        }, 1500);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    const handleButtonClick = (query) => {
        const userMessage = { sender: "user", text: query };
        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const botResponse = getBotResponse(query);

            if (typeof botResponse === "string") {
                setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
            } else {
                setMessages((prev) => [...prev, {
                    sender: "bot",
                    text: botResponse.text,
                    showSocialButtons: botResponse.showSocialButtons || false,
                    showAchievementButton: botResponse.showAchievementButton || false
                }]);
            }

        }, 1500);

    };

    const closeMenu = () => {
        setIsOpen(false);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
                closeMenu();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [chatbotRef]);

    const [showTooltip, setShowTooltip] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowComponent(true);
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 5000);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);


    return (
        <div className="chat-container" ref={chatbotRef}>

            {showComponent && (
                <>
                    <button onClick={toggleChat} className={isOpen ? "chat-close-icon" : "chat-open-icon"}>
                        <FontAwesomeIcon icon={isOpen ? faTimes : faRobot} size="xl" bounce={!isOpen} className={!isOpen ? "slow-bounce" : ""} />
                    </button>
                    {showTooltip && !isOpen && (
                        <div className="chat-tooltip">
                            Hi there! 👋 Need help with anything? <br></br>
                            Just click here to chat!
                        </div>
                    )}
                </>
            )}
            {isOpen && (
                <div className="chat-box">
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.sender === "user" ? "user-message" : "bot-message"}`}>
                                {msg.text}

                                {msg.showButtons && conversationStep === 0 && (
                                    <div className="predefined-buttons">
                                        <button onClick={() => handleButtonClick("About")}>About Allwin</button>
                                        <button onClick={() => handleButtonClick("Achievements")}>Achievements</button>
                                        <button onClick={() => handleButtonClick("Contact")}>Contact Allwin</button>
                                        <button onClick={() => handleButtonClick("Projects")}>Projects</button>
                                        {/* <button onClick={() => handleButtonClick("social media")}>Social medias</button> */}
                                    </div>
                                )}
                                {msg.showSocialButtons && (
                                    <div className="predefined-buttons">
                                        <button onClick={() => window.open("https://www.facebook.com/ekallwin", "_blank")}>Facebook</button>
                                        <button onClick={() => window.open("https://github.com/ekallwin", "_blank")}>GitHub</button>
                                        <button onClick={() => window.open("https://www.instagram.com/ekallwin", "_blank")}>Instagram</button>
                                        <button onClick={() => window.open("https://www.linkedin.com/in/ekallwin", "_blank")}>LinkedIn</button>
                                        <button onClick={() => window.open("https://www.threads.net/@ekallwin", "_blank")}>Threads</button>
                                        <button onClick={() => window.open("https://x.com/ekallwin", "_blank")}>X (Twitter)</button>
                                    </div>
                                )}
                                {msg.showAchievementButton && (
                                    <div className="predefined-buttons">
                                        <button onClick={() => navigate("/achievements")}>View Achievements</button>
                                    </div>
                                )}
                                {msg.sender === "bot" &&
                                    msg.text !== "Hello! How can I assist you today? Just ask me I'm always happy to help!" && msg.text !== "Sending your message... Please don't close this chat" &&
                                    (
                                        <div className="restart-chat">
                                            <button onClick={restartChat}>Restart Chat</button>
                                        </div>
                                    )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="chat-message bot-message typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chat-input">
                        {conversationStep === 2 ? (
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value.toLowerCase())}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter your email"
                                className="input-field"
                            />
                        ) : conversationStep === 3 ? (
                            <PhoneInput
                                country={"in"}
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                inputClass="phone-input"
                                containerClass="phone-input-container"
                                buttonClass="phone-dropdown-button"
                                dropdownClass="phone-dropdown"
                                enableSearch={true}
                            />
                        ) : (
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message..."
                                className="input-field"
                            />
                        )}
                        <button onClick={sendMessage} className="send-button"><FontAwesomeIcon icon={faPaperPlane} size="lg" /></button>
                    </div>
                </div>
            )}
        </div>
    );
}
