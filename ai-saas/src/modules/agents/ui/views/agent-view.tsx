"use client";

import { fetchAgents } from "@/app/api/agents/agents";
import { useQuery } from "@tanstack/react-query";

import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

export const AgentView = () => {
  const {
    data: agents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
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
    return <ErrorState title="Error" description="Error Fetching the Agents" />;
  }

  return (
    <div>
      <pre>
        {JSON.stringify(
          agents?.map((agent) => agent.name),
          null,
          2
        )}
      </pre>
    </div>
  );
};
