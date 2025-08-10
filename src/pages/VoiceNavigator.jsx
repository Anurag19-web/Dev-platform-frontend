import React, { useEffect, useState } from "react";
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
        <div className="voice-navigator flex flex-col items-center p-2">
            <button
                onClick={() => setListening((prev) => !prev)}
                aria-label={listening ? "Stop Listening" : "Start Listening"}
                className={`p-2 rounded-full transition-colors duration-300 focus:outline-none
          ${listening ? "bg-red-600 text-white" : "bg-green-600 text-white"}
        `}
                style={{ fontSize: "18px" }}
            >
                {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>
            <p className="mt-2 text-xs text-center text-gray-600 min-h-[1.5rem] dark:text-gray-300">
                {message}
            </p>
        </div>
    );
};