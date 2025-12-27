"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchAgents } from "@/app/api/agents/agents";

interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  temperature: number;
  top_p: number;
  presence_penalty: number;
  frequency_penalty: number;
}

export const AgentView = () => {
  const { data: agents } = useSuspenseQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
    staleTime: 30_000,
  });

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
