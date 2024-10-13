import { createClient } from "redis";
const pubClient = createClient({
  url: "redis://localhost:6379",
});

export async function pubConnect() {
  try {
    if (!pubClient.isOpen) {
      // Ensure we connect if not already connected
      console.log("Connecting pub client to Redis...");
      await pubClient.connect();
    }
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    throw error;
  }
}
export { pubClient };
