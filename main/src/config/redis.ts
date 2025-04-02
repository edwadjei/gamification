import Redis from "ioredis";
import "dotenv/config";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = new Redis(redisUrl);

redisClient.on("error", err => {
  console.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

export default redisClient;
