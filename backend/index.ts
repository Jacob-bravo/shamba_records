const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

import express from "express";
import cors from "cors";
import { connectDB } from "./src/config/db";
const helmet = require("helmet");
import { ENV } from "./src/config/env";
import { errorHandler, notFound } from "./src/middlewares/error.middleware";
import path from "path"
import appRoutes from "./src/routes/app_routes";

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

const app = express();
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "https://shamba-records-xcxg.onrender.com"],
      "img-src": [
        "'self'",
        "https:",
        "data:",
      ],
      "connect-src": [
        "'self'",
        "https://shamba-records-xcxg.onrender.com",
      ],

      "frame-ancestors": ["'self'"],
    },
  })
);

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/health", (_, res) =>
  res.json({ status: "ok", time: new Date() }),
);
app.use("/api/auth", appRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(ENV.PORT, () => console.log(`🚀 Server on port ${ENV.PORT}`));
});
