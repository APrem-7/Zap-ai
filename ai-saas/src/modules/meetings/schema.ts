import { z } from 'zod';

export const meetingInsertSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  agentId: z.string().min(1, { message: 'Agent ID is required' }),
});

export const meetingResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
  agentId: z.string(),
  agentName: z.string(),
  status: z.enum([
    'upcoming',
    'active',
    'completed',
    'processing',
    'cancelled',
  ]),
  startedAt: z.string().nullable(),
  endedAt: z.string().nullable(),
  transcriptUrl: z.string().nullable(),
  recordingUrl: z.string().nullable(),
  summary: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  duration: z.number().nullable(),
});

export const meetingUpdateSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  agentId: z.string().min(1, { message: 'Agent ID is required' }),
});

export const meetingQuerySchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.enum([
    'upcoming',
    'active',
    'completed',
    'processing',
    'cancelled',
  ]).optional(),  
  agentName: z.string().optional(),
});

export type MeetingQuery = z.infer<typeof meetingQuerySchema>;


export type MeetingResponse = z.infer<typeof meetingResponseSchema>;
