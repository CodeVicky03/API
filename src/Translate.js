import React, { useState } from 'react';
import axios from 'axios';

const Translator = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [language, setLanguage] = useState('es');

  // Translation API call
  const translateTextAPI = async (text, targetLang) => {
    const options = {
      method: 'POST',
      url: 'https://rapid-translate-multi-traduction.p.rapidapi.com/t',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '9a7b6ce910msh46589c1c55f9f60p12aab4jsn605fe8ce9b0b', // Replace YOUR_API_KEY with your actual API key
        'X-RapidAPI-Host': 'rapid-translate-multi-traduction.p.rapidapi.com'
      },
      data: {
        from: 'en',
        to: targetLang,
        q: text
      }
    };

    try {
      const response = await axios.request(options);
      setTranslatedText(response.data.translatedText); // Make sure this matches the API response structure
    } catch (error) {
      console.error(error);
      setTranslatedText('Error translating text');
    }
  };

  // Translate text using the API
  const translateText = () => {
    const normalizedInput = inputText.toLowerCase().trim();
    let targetLang = 'es'; // Default to Spanish
    if (language === 'fr') {
      targetLang = 'fr';
    } else if (language === 'es') {
      targetLang = 'es';
    }

    // Call the API to translate text
    translateTextAPI(normalizedInput, targetLang);
  };

  return (
    <div>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text to translate"
      />
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
      </select>
      <button onClick={translateText}>Translate</button>
      <div>Translation: {translatedText}</div>
    </div>
  );
};

export default Translator;
