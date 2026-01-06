const axios = require("axios");
const { decryptData, encryptData } = require("../utils/crypto");

exports.login = async (req, res) => {
  try {
    const baseURL = req.targetApiUrl;

    if (!baseURL) {
      return res
        .status(400)
        .json({ status: "false", message: "Invalid Context" });
    }

    const { payload } = req.body;
    if (!payload) {
      return res
        .status(400)
        .json({ status: "false", message: "No payload provided" });
    }

    const decryptedBody = decryptData(payload);

    if (!decryptedBody || !decryptedBody.username || !decryptedBody.password) {
      return res
        .status(400)
        .json({ status: "false", message: "Missing login parameters" });
    }

    const { username, password, languageCode } = decryptedBody;

    const coreResponse = await axios.post(
      `${baseURL}/personel/Login`,
      {
        username,
        password,
        languageCode: languageCode || "en",
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      }
    );

    const data = coreResponse.data;
    const encryptedResponse = encryptData(data);

    return res.json({
      payload: encryptedResponse,
    });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        status: "false",
        message: error.response.data?.message || "Login failed from Core API",
      });
    } else {
      return res.status(500).json({
        status: "false",
        message: "Internal Server Error",
      });
    }
  }
};
