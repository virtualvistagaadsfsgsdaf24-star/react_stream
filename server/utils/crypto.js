const CryptoJS = require('crypto-js');

const SECRET_KEY = process.env.VITE_ENCRYPTION_KEY;

const encryptData = (data) => {
  if (!data) return null;
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  } catch (err) {
    console.error(err);
    return null;
  }
};

const decryptData = (ciphertext) => {
  if (!ciphertext) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) return null;
    
    return JSON.parse(decryptedString);
  } catch (err) {
    console.error(err);
    return null;
  }
};

module.exports = { encryptData, decryptData };