// const GOOGLE_TRANSLATE_API = 'https://script.google.com/macros/s/AKfycbxPkKuJMSr0AB7XG15w8DrE_lJK8bT64r5sKw3ESjbSRlgpyIvUcPpQv8vrbJhiUzGHuw/exec';

// export const translateText = async (text, sourceLang, targetLang) => {
//   if (!text) return '';
  
//   try {
//     const response = await fetch(`${GOOGLE_TRANSLATE_API}?text=${encodeURIComponent(text)}&source=${sourceLang}&target=${targetLang}`);
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
    
//     const data = await response.json();
    
//     if (data.error) {
//       throw new Error(data.error);
//     }
    
//     return data.text || '';
//   } catch (error) {
//     console.error('Translation error:', error);
//     throw new Error('Translation failed. Please try again.');
//   }
// };

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