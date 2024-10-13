"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartwsServer = StartwsServer;
const ws_1 = require("ws");
const uuid_1 = require("uuid");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const PubSub_1 = require("./PubSub");
dotenv_1.default.config();
function StartwsServer(port) {
    //   const port = process.env.PORT;
    const app = (0, express_1.default)();
    const httpServer = app.listen(port);
    const wss = new ws_1.WebSocketServer({ server: httpServer });
    wss.on("connection", (ws) => __awaiter(this, void 0, void 0, function* () {
        const userId = (0, uuid_1.v4)();
        ws.userId = userId;
        PubSub_1.pubsubManager.userSubscribe(ws.userId, "room1");
    }));
}
