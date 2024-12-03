import { useState, useCallback, useEffect } from 'react';
import { MicrophoneIcon, SpeakerWaveIcon, ClipboardIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { useSpeech } from '../hooks/useSpeech';
import { translateText } from '../services/translator';
import LanguageSelect from './LanguageSelect';

const TranslatorBox = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState('');
  const { startListening, speak, isListening } = useSpeech();

  const handleTranslate = useCallback(async (text) => {
    if (!text) {
      setTranslatedText('');
      setError('');
      return;
    }

    setIsTranslating(true);
    setError('');

    try {
      const result = await translateText(text, sourceLang, targetLang);
      console.log("resulst",result)
      setTranslatedText(result);
    } catch (err) {
      setError(err.message);
      setTranslatedText('');
    } finally {
      setIsTranslating(false);
    }
  }, [sourceLang, targetLang]);

  const swapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleVoiceInput = () => {
    startListening((transcript) => {
      setSourceText(transcript);
      handleTranslate(transcript);
    });
  };

  

  const handleSpeak = (text, lang) => {
    console.log("hext",text,lang);
    speak(text, lang);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between space-x-4">
        <LanguageSelect
          value={sourceLang}
          onChange={setSourceLang}
        />

        <button
          onClick={swapLanguages}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
          aria-label="Swap languages"
        >
          <ArrowsRightLeftIcon className="h-6 w-6" />
        </button>

        <LanguageSelect
          value={targetLang}
          onChange={setTargetLang}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="relative">
            <textarea
              value={sourceText}
              onChange={(e) => {
                setSourceText(e.target.value);
                handleTranslate(e.target.value);
              }}
              className="w-full h-40 p-4 border rounded-lg resize-none bg-white dark:bg-gray-800 dark:text-white"
              placeholder="Enter text to translate..."
            />
            <div className="absolute bottom-2 right-2 flex space-x-2">
              <button
                onClick={handleVoiceInput}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isListening ? 'text-blue-500' : 'dark:text-white'
                }`}
                aria-label="Voice input"
              >
                <MicrophoneIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => copyToClipboard(sourceText)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                aria-label="Copy text"
              >
                <ClipboardIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <textarea
              value={error || translatedText}
              readOnly
              className={`w-full h-40 p-4 border rounded-lg resize-none ${
                error ? 'bg-red-50 text-red-600' : 'bg-gray-50 dark:bg-gray-900 dark:text-white'
              } ${isTranslating ? 'opacity-50' : ''}`}
              placeholder={isTranslating ? 'Translating...' : 'Translation will appear here...'}
            />
            <div className="absolute bottom-2 right-2 flex space-x-2">
              <button
                onClick={() => handleSpeak(translatedText, targetLang)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                disabled={isTranslating || !!error}
                aria-label="Text to speech"
              >
                <SpeakerWaveIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => copyToClipboard(translatedText)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                disabled={isTranslating || !!error}
                aria-label="Copy translation"
              >
                <ClipboardIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslatorBox;