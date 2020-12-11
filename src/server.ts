import express from "express";
import {createProxyMiddleware} from "http-proxy-middleware";
import dotenv from "dotenv";
import next from "next";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";

const app = next({dev});

const handler = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server
    .disable("x-powered-by")
    .use("/api", createProxyMiddleware({
      target: process.env.BACKEND_URL,
      pathRewrite: {
        "^/api": ""
      },
      secure: false
    }))
    .all("*", (req, res) => handler(req, res));

  server.listen(process.env.PORT, () => "Server is running");
});