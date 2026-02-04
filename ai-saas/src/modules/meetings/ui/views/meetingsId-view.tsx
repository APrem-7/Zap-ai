'use client';

import { getQueryClient } from '@/utils/query-client';
import { useQuery } from '@tanstack/react-query';
import { getOneMeeting } from '@/app/api/agents/meetings';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { json } from 'zod';
import { MeetingIdHeaderView } from './MeetingIdHeaderView';
import { MeetingDetailsCard } from '@/modules/meetings/components/meeting-details-card';

interface Props {
  meetingId: string;
}

export const MeetingsIdView = ({ meetingId }: Props) => {
  const queryClient = getQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['meetings', meetingId],
    queryFn: () => getOneMeeting(meetingId),
  });

  if (isLoading) {
    return (
      <LoadingState
        title="Loading meeting"
        description="Please wait while we fetch the meeting"
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Error loading meeting"
        description={error.message || 'Please try again'}
      />
    );
  }

  return (
    <>
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <MeetingIdHeaderView
          meetingId={meetingId}
          meetingName={data.name}
          onEdit={() => {}}
          onCancel={() => {}}
          onDelete={() => {}}
        />

        <MeetingDetailsCard
          meetingId={meetingId}
          meetingName={data.name}
          meetingAgentName={data.agentName}
          onStartMeeting={() => alert('start meeting clicked')}
          onScheduleMeeting={() => alert('schedule meeting clicked')}
        />
      </div>
    </>
  );
};
