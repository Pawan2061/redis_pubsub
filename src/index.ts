import express from "express";

import { createClient } from "redis";
import { pubConnect } from "./pub";
import { WebSocketServer } from "ws";

const app = express();
app.use(express.json());

const wss = new WebSocketServer({ port: 8050 });
export const pubClient = createClient({
  url: "redis://localhost:6379",
});

app.post("/message", async (req: any, res: any) => {
  try {
    const message = req.body.message;
    console.log(message);

    await pubClient.publish("message", JSON.stringify(message));

    return res.send(message);
  } catch (error) {
    console.log(error);
  }
});
async function startServer() {
  try {
    await pubConnect();

    app.listen(3000, () => {
      console.log("wokring");
    });
  } catch (error) {
    console.log(error);
  }
}

startServer();
