'use client';

import { GeneratedAvatar } from '@/components/generated-avatar';
import { ColumnDef } from '@tanstack/react-table';

import { type MeetingResponse } from '../schema';
import { cn } from '@/lib/utils';
import {
  CornerDownRightIcon,
  VideoIcon,
  ClockArrowUpIcon,
  Loader2Icon,
  CircleCheckIcon,
  CircleXIcon,
  ClockFadingIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import humanizeDuration from 'humanize-duration';
import { format } from 'path';
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1000, {
    largest: 1,
    round: true,
    units: ['h', 'm', 's'],
  });
}

const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: Loader2Icon,
  completed: CircleCheckIcon,
  processing: Loader2Icon,
  cancelled: CircleXIcon,
};

const statusColorMap = {
  upcoming: 'bg-yellow-500/20 text-yellow-800 border-yellow-800/5',
  active: 'bg-blue-500/20 text-blue-800 border-blue-800/5',
  completed: 'bg-emerald-500/20 text-emerald-800 border-emerald-800/5',
  cancelled: 'bg-rose-500/20 text-rose-800 border-rose-800/5',
  processing: 'bg-gray-300/20 text-gray-800 border-gray-800/5',
};

// export type Payment = {
//   id: string;
//   amount: number;
//   status: 'pending' | 'processing' | 'success' | 'failed';
//   email: string;
// };

export const columns: ColumnDef<MeetingResponse>[] = [
  {
    accessorKey: 'name',
    header: 'Meeting Name',
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <span className="font-semibold capitalize transition-colors duration-200 hover:text-foreground/80">
          {row.original.name}
        </span>
        <div className="flex items-center gap-x-2">
          <CornerDownRightIcon className="size-4" />
          <GeneratedAvatar
            seed={row.original.agentId}
            variant="bottsNeutral"
            className="size-4"
          />
          <span className="text-xs text-muted-foreground">
            {row.original.agentName}
          </span>
        </div>

        <span className="text-sm text-muted-foreground">
          {row.original.startedAt
            ? formatDuration(row.original.startedAt, 'MMM d')
            : ' '}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const Icon =
        statusIconMap[row.original.status as keyof typeof statusIconMap];
      // keyof typeof extracts valid keys from statusIconMap ("upcoming" | "active" | "completed" | "processing" | "cancelled")
      // This ensures TypeScript only allows valid status values, preventing runtime errors
      return (
        <Badge
          variant="outline"
          className={cn(
            'capitalize [&>svg]:size-4 text-muted-foreground',
            statusColorMap[row.original.status as keyof typeof statusColorMap]
          )}
        >
          <Icon
            className={cn(
              row.original.status === 'processing' && 'animate-spin'
            )}
          />
          <span className="transition-colors duration-200 group-hover:text-foreground">
            {row.original.status}
          </span>
        </Badge>
      );
    },
  },
  {
    accessorKey: 'duration',
    header: 'duration',
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="capitalize [&>svg]:size-4 flex items-center gap-x-2 text-muted-foreground"
      >
        <ClockFadingIcon className="text-blue-700" />
        <span className="transition-colors duration-200 group-hover:text-foreground">
          {row.original.duration
            ? formatDuration(row.original.duration)
            : 'No duration'}
        </span>
      </Badge>
    ),
  },
];
