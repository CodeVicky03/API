import React, { useState } from "react";
import Tesseract from "tesseract.js";
import Loader from "./Loader";
import { MdOutlineMusicOff } from "react-icons/md";
import { MdOutlineMusicNote } from "react-icons/md";
import { FaRegImage } from "react-icons/fa6";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    Tesseract.recognize(image, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(parseInt(m.progress * 100));
        }
      },
    })
      .then((result) => {
        setText(result.data.text);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleReadAloud = () => {
    if (!text) return;
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => {
      console.log("Speech synthesis started");
    };
    utterance.onend = () => {
      console.log("Speech synthesis ended");
    };
    speechSynthesis.speak(utterance);
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
                  {image && <img src={image} alt="" />}
                  <FaRegImage className="img-icon" />
                  <p>Choose what you want to convert into text</p>
                </div>
              </label>
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
                  onChange={(e) => setText(e.target.value)}
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
