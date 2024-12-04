

import { useState, useCallback, useEffect } from 'react';

export const useSpeech = () => {
  const [isListening, setIsListening] = useState(false);
  const [voices, setVoices] = useState([]);

  // Fetch available voices
  useEffect(() => {
    const fetchVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      console.log("Voices loaded:", availableVoices);
    };

    // Initial load and re-fetch on `voiceschanged`
    fetchVoices();
    window.speechSynthesis.onvoiceschanged = fetchVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Function to handle speech recognition
  const startListening = useCallback((onTranscript) => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, []);

  // Function to handle speech synthesis
  const speak = useCallback((text, lang = 'en') => {
    console.log(lang)
    console.log("lang",voices[0].lang)
    if (!text) {
      console.warn('No text provided.');
      return;
    }

    if (voices.length === 0) {
      console.warn('No voices available yet.');
      return;
    }

    // Attempt to find a voice that matches the specified language
    let selectedVoice = voices.find(voice => voice.lang === lang && voice.localService );
    console.log("Exact local voice:", selectedVoice);

    if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang === lang);
        console.log("Exact online voice:", selectedVoice);
    }

    if (!selectedVoice) {
      // Fallback to any available voice with the main language code (e.g., "ml")
      selectedVoice = voices.find(voice => voice.lang.startsWith(lang.split('-')[0]));
    }

    if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('en') && voice.localService);
        console.log("Fallback English voice:", selectedVoice);
    }

    console.log("Selected voice:", selectedVoice);

    if (selectedVoice) {
      console.log(text)
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;
      utterance.volume = 1; // Max volume
      utterance.rate = 1;   // Normal speed
      utterance.pitch = 1;  // Normal pitch

      // Optional event listeners for debugging
      utterance.onstart = () => console.log("Speech started");
      utterance.onend = () => console.log("Speech ended");
      utterance.onerror = (e) => console.error("Speech error:", e);

     
      
      window.speechSynthesis.speak(utterance);    
    } else {
      console.warn('No suitable voice found.');
    }
  }, [voices]);

  return {
    isListening,
    startListening,
    speak
  };
};
