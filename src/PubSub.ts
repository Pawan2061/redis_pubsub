import { createClient, RedisClientType } from "redis";
import { pubClient } from "./pub";
import { ChatClient } from "./interfaces";

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

    if (this.subscriptions.get(channel)?.length === 1) {
      this.redisClient.publish(channel, "connected to the sujith server");

      this.redisClient.subscribe(channel, (message) => {
        this.handleMessage(channel, message);
      });
      console.log(`subscribed to channel ${channel}`);
    }
  }

  public async userUnsubscribe(userId: string, channel: string) {
    // await this.handleMessage(channel, "disconnecting");

    // await this.redisClient.unsubscribe(userId);
    console.log("working here");

    await this.redisClient.publish(channel, JSON.stringify("hello by"));

    await this.redisClient.unsubscribe(channel);
    // const ids = this.subscriptions.get(channel);
    // console.log(ids);

    // if (ids) {
    //   const updatedUserIds = ids.filter((id) => id !== userId);
    //   console.log(updatedUserIds);

    //   this.subscriptions.set(channel, updatedUserIds);

    //   // Publish disconnect message when the last user unsubscribes
    //   if (updatedUserIds.length === 0) {
    //     this.redisClient.publish(channel, "disconnect");
    //     this.redisClient.unsubscribe(channel);
    //     console.log(`Unsubscribed from channel ${channel}`);
    //   }
    // }
    // // if (!this.subscriptions.get(channel)) {
    //   this.subscriptions.set(
    //     channel,
    //     this.subscriptions.get(channel)?.filter((id) => id !== userId) || []
    //   );
    // }

    // if (this.subscriptions.get(channel)?.length === 0) {
    //   //   this.redisClient.publish(channel, "disconnect");
    //   this.redisClient.unsubscribe(channel);
    //   console.log(`unsubscribed from the channel ${channel}`);
    // }
  }
  private async handleMessage(channel: string, message: string) {
    console.log(message, "here");

    await this.redisClient.publish(channel, JSON.stringify(message));
  }
  //listen for room message async await this.client .suscribe await ("roomid")
  public async disconnect() {
    await this.redisClient.quit();
  }
}

export const pubsubManager = PubSubManager.getInstance();
