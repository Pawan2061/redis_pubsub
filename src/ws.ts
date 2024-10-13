import { WebSocket, WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";
import express from "express";
import dotenv from "dotenv";
import { pubsubManager, PubSubManager } from "./PubSub";
import { Message } from "./interfaces";
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

    ws.send("this is connected");

    await pubsubManager.userSubscribe(ws.userId, "myroom");

    console.log(`User ${userId} connected and subscribed to "myroom"`);

    ws.on("message", async function message(data) {
      try {
        const message: Message = JSON.parse(data.toString());
        ws.send(`message is sent by ${userId}`);

        await pubsubManager.sendMessage(
          ws.userId,
          "myroom",
          JSON.stringify(message)
        );
      } catch (error) {
        console.log(error);

        return error;
      }
    });

    ws.on("close", async () => {
      console.log(
        `User ${userId} disconnected and unsubscribing from "myroom"`
      );
      await pubsubManager.userUnsubscribe(ws.userId, "myroom");
    });
  });
}
