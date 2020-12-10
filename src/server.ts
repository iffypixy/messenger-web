import express from "express";
import {createProxyMiddleware} from "http-proxy-middleware";
import next from "next";

const dev = process.env.NODE_ENV !== "production";

const app = next({dev});

app.prepare().then(() => {
  const server = express();

  const handler = app.getRequestHandler();

  server
    .disable("x-powered-by")
    .use("/api", createProxyMiddleware({
      target: process.env.BACKEND_URL,
      pathRewrite: {
        "^/api": "",
      },
      secure: false,
    }))
    .all("*", (req, res) => handler(req, res));

  server.listen(process.env.PORT, () => "Server is running");
});