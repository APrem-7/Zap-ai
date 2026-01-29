'use client';

import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewMeetingDialog } from './new-meeting-dialog';
import { useState } from 'react';
import { MeetingsSearchBar } from '../ui/meetings-search-bar';

export const MeetingsListHeader = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <NewMeetingDialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
        }}
      />
      <div className="pt-4 pb-2 px-4 md:px-8 flex flex-col gap-y-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <h5 className="font-semibold text-2xl tracking-tight text-foreground animate-slide-in">
              My Meetings
            </h5>
            <h3
              className="text-sm text-muted-foreground animate-slide-in"
              style={{ animationDelay: '100ms' }}
            >
              Manage and configure your meetings
            </h3>
          </div>

          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            <PlusIcon />
            New Meeting
          </Button>
        </div>

        <div className="flex items-center">
          <MeetingsSearchBar />
        </div>
      </div>
    </>
  );
};
