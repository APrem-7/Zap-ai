import Redis from 'ioredis';

class RedisService {
  private redisClient: Redis;
  constructor() {
    this.redisClient = new Redis(
      process.env.REDIS_URL || 'redis://localhost:6379'
    );
  }
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }
  async set<T>(key: string, data: T, ttl: 300) {
    try {
      await this.redisClient.setex(key, ttl, JSON.stringify(data));
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }
  async del(key: string) {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      console.error('Redis del error:', error);
    }
  }
  async invalidate(pattern: string) {
    try {
      const keys = await this.redisClient.keys(pattern);
      if (keys.length > 0) {
        await this.redisClient.del(...keys);
      }
    } catch (error) {
      console.error('Redis invalidate error:', error);
    }
  }
}

export const redis = new RedisService();
