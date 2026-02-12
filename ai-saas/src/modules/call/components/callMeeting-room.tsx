'use client';
import { useRouter, useParams } from 'next/navigation';
import { useCallStateHooks, CallingState } from '@stream-io/video-react-sdk';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { useCallContext } from '../providers/call-provider';
import { LoadingState } from '@/components/loading-state';
import { MeetingLayout } from './MeetingLayout';

export const MeetingRoom = () => {
  const router = useRouter();
  const { meetingId } = useParams<{ meetingId: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { leaveCall } = useCallContext();

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const handleLeave = () => setIsDialogOpen(true);
  const handleConfirmLeave = () => {
    leaveCall();
    router.push(`/meetings/${meetingId}`);
  };

  if (callingState !== CallingState.JOINED) {
    if (callingState === CallingState.LEFT) {
      router.push(`/meetings/${meetingId}`);
      return (
        <div className="flex h-screen w-full items-center justify-center bg-[#202124] text-white">
          <p>Call ended.</p>
        </div>
      );
    }

    return (
      <LoadingState
        title="Loading Call"
        description="Please wait while we join the call"
      />
    );
  }

  return (
    <>
      <MeetingLayout meetingId={meetingId} onLeave={handleLeave} />

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-w-sm bg-[#2d2e31] border-[#3c4043] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-white">
              Leave this call?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-[#9aa0a6]">
              Are you sure you want to leave the call? You can rejoin at any
              time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="mt-0 bg-[#3c4043] border-[#5f6368] text-white hover:bg-[#4a4d51] hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmLeave}
              className="bg-[#ea4335] hover:bg-[#d33426] text-white"
            >
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
