import { createClient, RedisClientType } from "redis";
import { pubClient } from "./pub";

export class PubSubManager {
  private static instance: PubSubManager;
  private redisClient: RedisClientType;
  private subscriptions: Map<string, string[]>;
  private constructor() {
    this.redisClient = createClient();

    this.redisClient.connect();
    this.subscriptions = new Map();
  }

  public static getInstance(): PubSubManager {
    if (!PubSubManager.instance) {
      PubSubManager.instance = new PubSubManager();
    }
    return PubSubManager.instance;
  }

  public userSubscribe(userId: string, channel: string) {
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, []);
    }
    this.subscriptions.get(channel)?.push(userId);

    if (this.subscriptions.get(channel)?.length == 1) {
      this.redisClient.subscribe(channel, (message) => {
        this.handleMessage(channel, message);
      });
      console.log(`subscribed to channel ${channel}`);
    }
  }

  public userUnsubscribe(userId: string, channel: string) {
    if (!this.subscriptions.get(channel)) {
      this.subscriptions.set(
        channel,
        this.subscriptions.get(channel)?.filter((id) => id !== userId) || []
      );
    }

    if (this.subscriptions.get(channel)?.length === 0) {
      this.redisClient.unsubscribe(channel);
      console.log(`unsubscribed from the channel ${channel}`);
    }
  }
  private async handleMessage(channel: string, message: string) {
    console.log("reached here");
    console.log(message);

    // this.subscriptions.get(channel)?.forEach((client) => {
    //   console.log(`sending message to user ${client}`);
    //   this.redisClient.subscribe(channel, (message: string) => {
    //     console.log(`subscribed to channel with message ${message}`);
    //   });
    // });
    await this.redisClient.publish(channel, JSON.stringify(message));
  }

  public async disconnect() {
    await this.redisClient.quit();
  }
}

export const pubsubManager = PubSubManager.getInstance();
