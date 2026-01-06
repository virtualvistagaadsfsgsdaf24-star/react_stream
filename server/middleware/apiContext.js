const axios = require("axios");

const COMPANY_LOOKUP_API = process.env.COMPANY_LOOKUP_API;
const urlCache = new Map();

const attachApiContext = async (req, res, next) => {
  try {
    const companyCode = req.headers["x-company-code"];

    if (!companyCode) {
      return next();
    }

    let targetBaseUrl = urlCache.get(companyCode);

    if (!targetBaseUrl) {
      const lookup = await axios.post(
        `${COMPANY_LOOKUP_API}/personel/Company/getcompany`,
        {
          companyCode,
        }
      );

      const info = lookup.data.dataListSet && lookup.data.dataListSet[0];
      if (info && info.apiurl) {
        targetBaseUrl = info.apiurl;
        urlCache.set(companyCode, targetBaseUrl);
      } else {
        return res
          .status(400)
          .json({ status: "false", message: "Company Config Not Found" });
      }
    }

    req.targetApiUrl = targetBaseUrl;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ status: "false", message: "Internal Proxy Error" });
  }
};

module.exports = attachApiContext;
