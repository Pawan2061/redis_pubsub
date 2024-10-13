import { WebSocket, WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";
import express from "express";
import dotenv from "dotenv";
import { pubsubManager, PubSubManager } from "./PubSub";
import { ChatClient } from "./interfaces";
dotenv.config();

export function StartwsServer(port: number) {
  //   const port = process.env.PORT;
  const app = express();
  const httpServer = app.listen(port);
  const wss = new WebSocketServer({ server: httpServer });

  wss.on("connection", async (ws: ChatClient) => {
    const userId = uuid();
    ws.userId = userId;

    pubsubManager.userSubscribe(ws.userId, "room1");
  });
}
