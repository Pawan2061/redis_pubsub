import { createClient } from "redis";
import { pubConnect } from "./pub";

const subClient = createClient({
  url: "redis://localhost:6379",
});

export async function subConnect() {
  try {
    if (!subClient.isOpen) {
      // Connect only if not already connected
      console.log("Connecting sub client to Redis...");
      await subClient.connect();
    }
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    throw error;
  }
}
async function startServer() {
  try {
    await subConnect();
  } catch (error) {
    console.log(error);
  }
}

startServer();
