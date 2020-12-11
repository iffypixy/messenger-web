// @ts-ignore
var express = require("express");
var createProxyMiddleware = require("http-proxy-middleware").createProxyMiddleware;
var dotenv = require("dotenv");
var next = require("next");
// import express from "express";
// import {createProxyMiddleware} from "http-proxy-middleware";
// import dotenv from "dotenv";
// import next from "next";
dotenv.config();
var dev = process.env.NODE_ENV !== "production";
var app = next({ dev: dev });
app.prepare().then(function () {
    var server = express();
    var handler = app.getRequestHandler();
    server
        .disable("x-powered-by")
        .use("/api", createProxyMiddleware({
        target: process.env.BACKEND_URL,
        pathRewrite: {
            "^/api": ""
        },
        secure: false
    }))
        .all("*", function (req, res) { return handler(req, res); });
    server.listen(process.env.PORT, function () { return "Server is running"; });
});
