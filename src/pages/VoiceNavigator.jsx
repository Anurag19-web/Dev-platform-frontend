import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { toggleNotifications } from "../slices/SettingSlice";
import { useDispatch } from "react-redux";

export const VoiceNavigator = () => {
    const navigate = useNavigate();
    const [listening, setListening] = useState(false);
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
            setMessage("Speech Recognition API not supported in this browser.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const lastResultIndex = event.results.length - 1;
            const transcript = event.results[lastResultIndex][0].transcript
                .trim()
                .toLowerCase();
            setMessage(`Heard: "${transcript}"`);
            console.log("Voice command:", transcript);

            // Simple commands:
            if (transcript === "landing") {
                navigate("/");
            } else if (transcript === "home") {
                navigate("/home");
            } else if (transcript === "setting") {
                navigate("/setting");
            } else if (transcript === "profile") {
                navigate("/userprofile");
            } else if (transcript === "profiles") {
                navigate("/userprofilesdata");
            } else if (transcript === "notification on"){
                dispatch(toggleNotifications());
                setTimeout(() => setListening(false), 100);
                } else if (transcript === "notification off"){
                dispatch(!toggleNotifications());
                setTimeout(() => setListening(false), 100);
            } else if (transcript === "back"){
                navigate(-1) 
            } else {
                setMessage(`Unrecognized command: "${transcript}"`);
            }
        };

        recognition.onerror = (event) => {
            setMessage(`Error occurred: ${event.error}`);
        };

        if (listening) {
            recognition.start();
            setMessage("Listening...");
        } else {
            recognition.stop();
            setMessage("Voice recognition stopped.");
        }

        return () => {
            recognition.stop();
            recognition.onresult = null;
            recognition.onerror = null;
        };
    }, [listening, navigate]);
return (
  <div className="voice-navigator flex flex-col items-center gap-1">
    <motion.button
      type="button"
      onClick={() => setListening((prev) => !prev)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="p-2 rounded-full bg-gray-800 hover:bg-blue-600 text-gray-300 relative"
    >
      {listening ? (
        <>
          <FaMicrophoneSlash size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </>
      ) : (
        <FaMicrophone size={20} />
      )}
    </motion.button>
  </div>
);


};