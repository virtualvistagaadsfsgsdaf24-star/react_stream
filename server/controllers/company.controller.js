const axios = require("axios");
const { encryptData, decryptData } = require("../utils/crypto");

exports.getCompanyInfo = async (req, res) => {
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
    if (!decryptedBody || !decryptedBody.companyCode) {
      return res
        .status(400)
        .json({ status: "false", message: "Invalid encrypted data" });
    }

    const companyCode = decryptedBody.companyCode.trim().toUpperCase();

    const coreResponse = await axios.post(
      `${baseURL}/personel/Company/getcompany`,
      { companyCode: companyCode },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      }
    );

    const data = coreResponse.data;
    const company = data.dataListSet && data.dataListSet[0];

    if (!company || !company.apiurl) {
      return res.status(404).json({
        status: "false",
        message: data.message || data.statusMessage || "Data not found",
      });
    }

    const responseData = {
      status: "true",
      company: {
        companyCode: company.companyCode,
        companyName: company.companyName,
      },
    };

    return res.json({
      payload: encryptData(responseData),
    });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        status: "false",
        message: error.response.data?.message || "Lookup Failed",
      });
    }
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.getUserHoldingCompanies = async (req, res) => {
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

    if (!decryptedBody || !decryptedBody.userID || !decryptedBody.token) {
      return res
        .status(400)
        .json({ status: "false", message: "Missing parameters" });
    }

    const { userID, token } = decryptedBody;

    const coreResponse = await axios.post(
      `${baseURL}/personel/User/getuserholdingcompany`,
      {
        recordStatus: "A",
        userName: userID,
        sessionID: 0,
        sessionUserID: userID,
        logActionUserID: userID,
        logActionUsername: userID,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
        message: error.response.data?.message || "Failed to fetch companies",
      });
    }
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
