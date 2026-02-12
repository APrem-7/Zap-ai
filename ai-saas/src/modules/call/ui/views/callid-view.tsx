'use client';
import { useGetCallById } from '@/hooks/useGetCallById';
import { MeetingRoom } from '../../components/callMeeting-room';
import { JoinCallCard } from '../components/join-call-card';
import { CallProvider } from '../../providers/call-provider';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  StreamCall,
  StreamTheme,
} from '@stream-io/video-react-sdk';

import { getOneMeeting } from '@/app/api/agents/meetings';
import { createAuthClient } from 'better-auth/react';

import { LoadingState } from '@/components/loading-state';
import { ErrorState } from '@/components/error-state';

interface Props {
  meetingId: string;
}

const { useSession } = createAuthClient();

export const CallIdView = ({ meetingId }: Props) => {
  const { data: session } = useSession();

  const [confirmJoin, setConfirmJoin] = useState<boolean>(false);
  const router = useRouter();

  const { call, isCallLoading } = useGetCallById(meetingId);

  const { data: meeting } = useQuery({
    queryKey: ['meeting', meetingId],
    queryFn: () => getOneMeeting(meetingId),
    enabled: !!meetingId,
  });

  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    if (!call || isJoining) return;
    try {
      setIsJoining(true);
      await call.join();
      setConfirmJoin(true);
    } catch (error) {
      console.error('Failed to join call:', error);
      setIsJoining(false);
    }
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
    <main className="min-h-screen w-full flex items-center justify-center bg-[#202124]">
      <StreamCall call={call}>
        <StreamTheme>
          <CallProvider>
            {confirmJoin ? (
              <MeetingRoom />
            ) : (
              <JoinCallCard
                meetingId={meetingId}
                meetingTitle={meeting?.meetings?.name || 'Team Meeting'}
                hostName={call.state.createdBy?.name || 'Unknown Host'}
                participantCount={call.state.members?.length || 1}
                onJoin={handleJoin}
                isJoining={isJoining}
              />
            )}
          </CallProvider>
        </StreamTheme>
      </StreamCall>
    </main>
  );
};
