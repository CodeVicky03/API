import React, { useState } from "react";
import Tesseract from "tesseract.js";
import axios from "axios";
import Loader from "./Loader";
import { MdOutlineMusicOff, MdOutlineMusicNote } from "react-icons/md";
import { FaRegImage } from "react-icons/fa6";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [language, setLanguage] = useState("eng");

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { data: { text: recognizedText } } = await Tesseract.recognize(image, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(parseInt(m.progress * 100));
          }
        },
      });
      setText(recognizedText);
  
      const options = {
        method: "POST",
        url: "https://rapid-translate-multi-traduction.p.rapidapi.com/t",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": "9a7b6ce910msh46589c1c55f9f60p12aab4jsn605fe8ce9b0b",
          "X-RapidAPI-Host": "rapid-translate-multi-traduction.p.rapidapi.com",
        },
        data: {
          from: "en",
          to: language,
          q: recognizedText,
        },
      };
  
      const response = await axios.request(options);
      setText(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReadAloud = async () => {
    if (!text) return;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => {
      console.log("Speech synthesis started");
    };
    utterance.onend = () => {
      console.log("Speech synthesis ended");
    };
    window.speechSynthesis.speak(utterance);
  };
  

  const togglePause = () => {
    if (!speechSynthesis.speaking) return;

    if (isPaused) {
      speechSynthesis.resume();
    } else {
      speechSynthesis.pause();
    }
    setIsPaused(!isPaused);
  };

  return (
    <div className="container" style={{ height: "100vh" }}>
      <div className="header">
        <div className="main-container">
          <div className="left">
            <h1>SCRIPT SENSE</h1>
            <>
              <input
                type="file"
                hidden
                id="imageUpload"
                onChange={(e) =>
                  setImage(URL.createObjectURL(e.target.files[0]))
                }
                className="file"
              />
              <label htmlFor="imageUpload">
                <div className="label">
                  {image && <img src={image} alt="Selected" />}
                  <FaRegImage className="img-icon" />
                  <p>Choose what you want to convert into text</p>
                </div>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="eng">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="ja">Japanese</option>
                <option value="zh-CN">Chinese</option>
                <option value="ru">Russian</option>
                <option value="ar">Arabic</option>
                <option value="ko">Korean</option>
                <option value="pt">Portuguese</option>
                <option value="ta">Tamil</option>
              </select>
              <input
                type="button"
                onClick={handleSubmit}
                value="Convert"
                className="btn"
              />
            </>
          </div>
          <div className="right">
            {isLoading && (
              <div className="pro">
                <Loader />
                <p className="progress">Converting: {progress}%</p>
              </div>
            )}
            {!isLoading && text && (
              <div className="result">
                <textarea
                  rows="20"
                  value={text}
                  className="textarea"
                  readOnly
                ></textarea>
                <div className="voice">
                  <button onClick={handleReadAloud} className="btn-one">
                    Read Aloud
                  </button>
                  <button onClick={togglePause} className="btn-voice">
                    {isPaused ? (
                      <MdOutlineMusicOff
                        style={{ padding: "0", margin: "0", fontSize: "22px" }}
                      />
                    ) : (
                      <MdOutlineMusicNote
                        style={{ padding: "0", margin: "0", fontSize: "22px" }}
                      />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
