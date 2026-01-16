'use client';
import { useQuery } from '@tanstack/react-query';
import { getOneAgent } from '@/app/api/agents/agents';
import { LoadingState } from '@/components/loading-state';
import { ErrorState } from '@/components/error-state';
import { getQueryClient } from '@/utils/query-client';
import { AgentIdHeaderView } from '@/modules/agents/ui/components/agent-id-header-view';
import { GeneratedAvatar } from '@/components/generated-avatar';
import { Badge } from '@/components/ui/badge';
import { VideoIcon } from 'lucide-react';
interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  console.log(agentId);
  const queryClient = getQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['agents', agentId],
    queryFn: () => getOneAgent(agentId),
  });
  if (isLoading) {
    return (
      <LoadingState
        title="Loading agents"
        description="Please wait while we fetch the agents"
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Error loading agents"
        description={error.message || 'Please try again'}
      />
    );
  }

  return (
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
      <AgentIdHeaderView
        agentId={agentId}
        agentName={data.name}
        onEdit={() => {}}
        onCancel={() => {}}
      />
      <div className="bg-white rounded-lg border">
        <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
          <div className="flex items-center gap-x-3">
            <GeneratedAvatar
              seed={data.name}
              variant="bottsNeutral"
              className="size-16"
            />
            <h2 className="text-2xl font-medium">{data.name}</h2>
          </div>
          <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
            <VideoIcon />
            {data.meetingCount} {data.meetingCount === 1 ? 'Meeting' : 'Meetings'}
          </Badge>
          <div className="flex flex-col gap-y-4">
            <p className="text-lg font-medium">Instructions</p>
            <p className="text-neutral-800">{data.instructions}</p>
          </div>


        </div>
      </div>
    </div>
  );
};
