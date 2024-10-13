import { createClient, RedisClientType } from "redis";
import { ChatClient } from "./interfaces";

export class PubSubManager {
  private static instance: PubSubManager;
  private pubClient: RedisClientType;
  private subClient: RedisClientType;

  private subscriptions: Map<string, string[]>;

  private constructor() {
    this.subClient = createClient({ url: "redis://localhost:6379" });

    this.pubClient = createClient({ url: "redis://localhost:6379" });

    // this.subClient.connect();
    // this.pubClient.connect();
    this.subscriptions = new Map();
  }
  private async ensureRedisConnection() {
    try {
      if (!this.pubClient.isOpen) {
        console.log("Connecting pub client to Redis...");
        await this.pubClient.connect();
      }
      if (!this.subClient.isOpen) {
        console.log("Connecting sub client to Redis...");
        await this.subClient.connect();
      }
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      throw error;
    }
  }

  public static getInstance(): PubSubManager {
    if (!PubSubManager.instance) {
      PubSubManager.instance = new PubSubManager();
    }
    return PubSubManager.instance;
  }

  public async userSubscribe(userId: string, channel: string) {
    await this.ensureRedisConnection();
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, []);
    }
    this.subscriptions.get(channel)?.push(userId);

    if (this.subscriptions.get(channel)?.length === 1) {
      await this.pubClient.publish(
        channel,
        JSON.stringify("connected to the sujith server")
      );

      // this.subClient.subscribe(channel, (message) => {
      //   this.handleMessage(channel, message);
      // });
      console.log(`subscribed to channel ${channel}`);
    }
  }

  public async userUnsubscribe(userId: string, channel: string) {
    await this.ensureRedisConnection();

    await this.pubClient.publish(channel, JSON.stringify("hello by"));
    await this.subClient.unsubscribe(userId);

    await this.subClient.unsubscribe(channel, () => {
      this.handleMessage(channel, "disconnect");
    });
  }
  private async handleMessage(channel: string, message: string) {
    console.log(message, "here");

    await this.pubClient.publish(channel, JSON.stringify(message));
  }

  public async sendMessage(userId: string, channel: string, data: any) {
    await this.ensureRedisConnection();

    await this.pubClient.publish(channel, JSON.stringify(data));
  }
  public async disconnect() {
    await this.pubClient.quit();
    await this.subClient.quit();
  }
}

export const pubsubManager = PubSubManager.getInstance();
