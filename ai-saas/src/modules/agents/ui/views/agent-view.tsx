"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchAgents } from "@/app/api/agents/agents";
import { LoadingState } from "@/components/loading-state";

export const AgentView = () => {
  const {
    data: agents,
    isLoading,
    isFetching,
    status,
    fetchStatus,
  } = useQuery({
    queryKey: ["agents"],
    throwOnError: true,
    queryFn: async () => {
      console.log("🌐 CLIENT fetching agents (network request)");
      return await fetchAgents();
    },
    staleTime: 30000,
  });

  console.log("🔍 Query state:", {
    isLoading,
    isFetching,
    status,
    fetchStatus,
  });

  if (isLoading) {
    return (
      <LoadingState
        title="Loading agents"
        description="Please wait while we fetch the agents"
      />
    );
  }

  return (
    <div>
      <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
        <p>Status: {status}</p>
        <p>Fetch Status: {fetchStatus}</p>
        <p>Is Loading: {isLoading ? "Yes" : "No"}</p>
        <p>Is Fetching: {isFetching ? "Yes" : "No"}</p>
      </div>
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
