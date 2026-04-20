const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
import express from "express";
import cors from "cors";
import { connectDB } from "./src/config/db";
import { ENV } from "./src/config/env";
import { errorHandler, notFound } from "./src/middlewares/error.middleware";
const helmet = require("helmet");
import path from "path"
import appRoutes from "./src/routes/app_routes";
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
const PORT = process.env.PORT || ENV.PORT || 5000;
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


app.get("/api/health", (_, res) =>
  res.json({ status: "ok", time: new Date() }),
);
app.use("/api/auth", appRoutes);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
