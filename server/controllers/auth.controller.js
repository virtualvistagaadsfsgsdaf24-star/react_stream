const axios = require('axios');
const { decryptData, encryptData } = require('../utils/crypto');

exports.login = async (req, res) => {
  try {
    const { payload } = req.body;
    if (!payload) {
      return res.status(400).json({ status: "false", message: "No payload provided" });
    }

    const decryptedBody = decryptData(payload);

    if (!decryptedBody || !decryptedBody.username || !decryptedBody.password || !decryptedBody.baseURL) {
      return res.status(400).json({ status: "false", message: "Missing login parameters" });
    }

    const { username, password, languageCode, baseURL } = decryptedBody;

    console.log(`[BFF] Login Request for user: ${username}`);

    const coreResponse = await axios.post(
      `${baseURL}/personel/Login`,
      {
        username,
        password,
        languageCode: languageCode || 'en'
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      }
    );

    const data = coreResponse.data;
    const encryptedResponse = encryptData(data);

    return res.json({
      payload: encryptedResponse
    });

  } catch (error) {
    console.error("[BFF Login Error]", error.message);

    if (error.response) {
      return res.status(error.response.status).json({
        status: "false",
        message: error.response.data?.message || "Login failed from Core API"
      });
    } else {
      return res.status(500).json({
        status: "false",
        message: "Internal Server Error"
      });
    }
  }
};