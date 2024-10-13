"use strict";
// import express from "express";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const ws_1 = require("./ws");
dotenv_1.default.config();
function startServer() {
    const port = parseInt(process.env.PORT);
    (0, ws_1.StartwsServer)(port);
}
startServer();
