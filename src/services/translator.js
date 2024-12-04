

const EXPRESS_SERVER_API = 'http://localhost:3000/translate';

export const translateText = async (text, sourceLang, targetLang) => {
  const source_lang=sourceLang;
  const target_lang=targetLang;
  if (!text) return '';

  try {
    const response = await fetch(EXPRESS_SERVER_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, source_lang, target_lang })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("data",data)
    
    if (data.error) {
      throw new Error(data.error);
    }

    return data.translatedText || '';
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Translation failed. Please try again.');
  }
};