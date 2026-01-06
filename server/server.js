require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const apiContextMiddleware = require("./middleware/apiContext");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api", apiContextMiddleware);

const routesPath = path.join(__dirname, "routes");

if (fs.existsSync(routesPath)) {
  fs.readdirSync(routesPath).forEach((file) => {
    if (file.endsWith(".routes.js")) {
      const routeName = file.split(".")[0];
      const routeModule = require(path.join(routesPath, file));
      app.use(`/api/${routeName}`, routeModule);
    }
  });
}

app.get("/", (req, res) => {
  res.send("BFF Server is Running...");
});

app.listen(PORT, () => {});
