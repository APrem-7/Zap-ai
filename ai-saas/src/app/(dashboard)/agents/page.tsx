import { fetchAgents } from "@/app/api/agents/agents";
import { AgentView } from "@/modules/agents/ui/views/agent-view";
import { getQueryClient } from "@/utils/query-client";



import { dehydrate, HydrationBoundary } from "@tanstack/react-query";


const Page = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      console.log("🖥️ SERVER fetching agents");
      return await fetchAgents();
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="p-4 flex flex-col gap-y-4">
        <AgentView />
      </div>
    </HydrationBoundary>
  );
};

export default Page;
