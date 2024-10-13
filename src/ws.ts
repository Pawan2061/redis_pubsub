import { WebSocket, WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";
import express from "express";
import dotenv from "dotenv";
import { pubsubManager, PubSubManager } from "./PubSub";
dotenv.config();

export interface ChatClient extends WebSocket {
  userId: string;
}

export function StartwsServer(port: number) {
  const app = express();
  const httpServer = app.listen(port);
  const wss = new WebSocketServer({ server: httpServer });

  wss.on("connection", async (ws: ChatClient) => {
    const userId = uuid();
    ws.userId = userId;

    // Subscribe user to "myroom" when connected
    await pubsubManager.userSubscribe(ws.userId, "myroom");

    console.log(`User ${userId} connected and subscribed to "myroom"`);

    // Listen for the "close" event for each WebSocket connection
    ws.on("close", async () => {
      console.log(
        `User ${userId} disconnected and unsubscribing from "myroom"`
      );
      await pubsubManager.userUnsubscribe(userId, "myroom");
    });
  });
}
