import { createClient, RedisClientType } from "redis";

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
  private handleMessage(channel: string, message: string) {
    this.subscriptions.get(channel)?.forEach((userId) => {
      console.log(`sending message to user ${userId}`);
    });
  }

  public async disconnect() {
    await this.redisClient.quit();
  }
}
