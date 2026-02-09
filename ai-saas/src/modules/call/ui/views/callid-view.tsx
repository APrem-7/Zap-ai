'use client';
import { useGetCallById } from '@/hooks/useGetCallById';
import { MeetingRoom } from '../../components/callMeeting-room';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getQueryClient } from '@/utils/query-client';
import { useQuery } from '@tanstack/react-query';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import {
  StreamCall,
  StreamTheme,
  PaginatedGridLayout,
  CallControls,
} from '@stream-io/video-react-sdk';

import { getOneMeeting } from '@/app/api/agents/meetings';
import { authClient } from '@/lib/auth-client';
import { createAuthClient } from 'better-auth/react';

import { LoadingState } from '@/components/loading-state';
import { ErrorState } from '@/components/error-state';

interface Props {
  meetingId: string;
}

const { useSession } = createAuthClient();

export const CallIdView = ({ meetingId }: Props) => {
  const query = getQueryClient();
  const client = useStreamVideoClient();

  const { data: session, isPending, error } = useSession();

  const [confirmJoin, setConfirmJoin] = useState<boolean>(false);
  const [camMicEnabled, setCamMicEnabled] = useState<boolean>(false);
  const router = useRouter();

  const { call, isCallLoading } = useGetCallById(meetingId);

  useEffect(() => {
    if (camMicEnabled) {
      call?.camera.enable();
      call?.microphone.enable();
    } else {
      call?.camera.disable();
      call?.microphone.disable();
    }
  }, [call, camMicEnabled]);

  const handleJoin = () => {
    call?.join();
    setConfirmJoin(true);
  };

  if (isCallLoading) {
    return (
      <LoadingState
        title="Loading call"
        description="Please wait while we load the call details..."
      />
    );
  }

  if (!call) {
    return (
      <ErrorState
        title="Call Not found"
        description="There was an error loading the call details. Please try again later."
      />
    );
  }

  return (
    <main className="min-h-screen w-full items-center justify-center">
      <StreamCall call={call}>
        <StreamTheme>
          {confirmJoin ? (
            <MeetingRoom />
          ) : (
            <div className="flex flex-col items-center justify-center gap-5">
              <h1 className="text-3xl font-bold">Join Call</h1>
              <p className="text-lg">
                Are you sure you want to join this call?
              </p>
              <div className="flex gap-5">
                <button
                  onClick={handleJoin}
                  className="px-4 py-3 bg-green-600 text-green-50"
                >
                  Join
                </button>
                <button
                  onClick={() => router.push(`/meetings/${meetingId}`)}
                  className="px-4 py-3 bg-red-600 text-red-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};
