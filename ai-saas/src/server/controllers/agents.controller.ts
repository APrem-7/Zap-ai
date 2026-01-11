import { db } from '@/db';
import { agents } from '@/db/schema';

import { eq, ilike, count, and } from 'drizzle-orm';

import { Request, Response } from 'express';
import { agentInsertSchema } from '@/modules/agents/schema';

import { redis } from '@/lib/redis';

import { DEFAULT_PAGE_SIZE } from '@/constant';

export const getAgents = async (req: Request, res: Response) => {
  try {
    const cacheKey = `agents:${req.user.id}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      // Data is in cache, return it
      return res.json(cachedData);
    }

    const { search } = req.query;
    const [data] = await db
      .select({
        id: agents.id,
        name: agents.name,
        instructions: agents.instructions,
      })
      .from(agents)
      .where(
        and(
          eq(agents.userId, req.user.id),
          search ? ilike(agents.name, `%${search}%`) : undefined
        )
      );

    const [total] = await db
      .select({
        count: count(),
      })
      .from(agents)
      .where(
        and(
          eq(agents.userId, req.user.id),
          search ? ilike(agents.name, `%${search}%`) : undefined
        )
      );

    const totalPage = Math.ceil(total.count / DEFAULT_PAGE_SIZE);
    await redis.set(cacheKey, { data, totalPage, total }, 300); //If not in the cache Set it in the cache

    return res.json({ data, totalPage, total }); //
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch agents' });
  }
};

export const createAgents = async (req: Request, res: Response) => {
  try {
    const cacheKey = `agents:${req.user.id}`;
    const input = agentInsertSchema.parse(req.body); // 🔥 REAL SECURITY
    const [data] = await db
      .insert(agents)
      .values({
        name: input.name,
        instructions: input.instruction,
        userId: req.user.id,
      })
      .returning();

    await redis.del(cacheKey);

    return res.json(data) || { message: 'Failed to create agent' };
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed to create agent',
    });
  }
};
