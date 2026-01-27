'use client';

import { GeneratedAvatar } from '@/components/generated-avatar';
import { ColumnDef } from '@tanstack/react-table';

import { type MeetingResponse } from '../schema';

import {
  CornerDownRightIcon,
  VideoIcon,
  ClockArrowUpIcon,
  Loader2Icon,
  CircleCheckIcon,
  CircleXIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

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
          <span className="text-xs text-muted-foreground">
            {row.original.agentName}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'meetingcounts',
    header: 'Meetings',
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="flex items-center gap-x-2 [&>svg]:size-4 smooth-transition hover:shadow-sm hover:bg-accent/50 group"
      >
        <VideoIcon className="text-blue-700 transition-transform duration-200 group-hover:scale-110" />
        <span className="transition-colors duration-200 group-hover:text-foreground">
          5 Meetings
        </span>
      </Badge>
    ),
  },
];
