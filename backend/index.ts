const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

import express from "express";
import cors from "cors";
import { connectDB } from "./src/config/db";
import { ENV } from "./src/config/env";
import { errorHandler, notFound } from "./src/middlewares/error.middleware";
import path from "path"
import appRoutes from "./src/routes/app_routes";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());


app.get("/api/health", (_, res) =>
  res.json({ status: "ok", time: new Date() }),
);
app.use("/api/auth", appRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(ENV.PORT, () => console.log(`🚀 Server on port ${ENV.PORT}`));
});
