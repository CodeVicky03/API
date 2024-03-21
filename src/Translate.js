import React, { useState } from 'react';

const Translator = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [language, setLanguage] = useState('es');

  const dictionary = {
    hello: {
      es: 'hola',
      fr: 'bonjour',
    },
    goodbye: {
      es: 'adiós',
      fr: 'au revoir',
    },
  };

  const translateText = () => {
    const normalizedInput = inputText.toLowerCase().trim();
    if (dictionary[normalizedInput] && dictionary[normalizedInput][language]) {
      setTranslatedText(dictionary[normalizedInput][language]);
    } else {
      setTranslatedText('Translation not found');
    }
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