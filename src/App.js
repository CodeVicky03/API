import React, { useState } from "react";
import Tesseract from "tesseract.js";
import Loader from "./Loader";
import { MdOutlineMusicOff } from "react-icons/md";
import { MdOutlineMusicNote } from "react-icons/md";

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
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    } else if (speechSynthesis.speaking) {
      speechSynthesis.pause();
    }
    setIsPaused(!isPaused);
  };

  return (
    <div className="container" style={{ height: "100vh" }}>
      <div className="header">
        <div className="main-container">
          {!isLoading && <h1>Image To Text</h1>}
          {isLoading && (
            <>
              <Loader />
              <p className="progress">Converting: {progress}%</p>
            </>
          )}
          {!isLoading && !text && (
            <>
              <input
                type="file"
                onChange={(e) =>
                  setImage(URL.createObjectURL(e.target.files[0]))
                }
                className="file"
              />
              <input
                type="button"
                onClick={handleSubmit}
                value="Convert"
                className="btn"
              />
            </>
          )}
          {!isLoading && text && (
            <>
              <textarea
                rows="30"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
