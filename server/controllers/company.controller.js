const axios = require("axios");
const { encryptData, decryptData } = require("../utils/crypto");

const COMPANY_LOOKUP_API = process.env.COMPANY_LOOKUP_API;

exports.getCompanyInfo = async (req, res) => {
  try {
    if (!COMPANY_LOOKUP_API) {
      return res
        .status(500)
        .json({ status: "false", message: "Server Misconfiguration" });
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
      `${COMPANY_LOOKUP_API}/personel/Company/getcompany`,
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

    const encryptedResponse = encryptData(responseData);

    return res.json({
      payload: encryptedResponse,
    });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        status: "false",
        message: error.response.data?.message || "Lookup Failed",
      });
    } else {
      return res.status(500).json({
        status: "false",
        message: "Internal Server Error",
      });
    }
  }
};
