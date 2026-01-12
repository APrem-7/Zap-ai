import {
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from '@/components/ui/command';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { fetchAgents, SearchAgents } from '@/app/api/agents/agents';
import { useQuery } from '@tanstack/react-query';
import { Loader2, BotIcon } from 'lucide-react';
import { GeneratedAvatar } from '@/components/generated-avatar';
import { useQueryState, parseAsString } from 'nuqs';
import { useRouter } from 'next/navigation';
interface Agent {
  id: string;
  name: string;
  instructions: string;
}

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
  const router = useRouter();
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault('')
  );
  useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);
  const { data: agentsData, isLoading } = useQuery({
    queryKey: ['agents', search],
    queryFn: () => SearchAgents(search || ''),
    enabled: open,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const agents = agentsData?.data || [];

  const handleAgentSelect = (agent: Agent) => {
    console.log('Selected agent:', agent);

    router.push(`/agents/${agent.id}`);
    setOpen(false);
    setSearch('');
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Find a meeting or agent..."
        value={search ?? ''}
        onValueChange={setSearch}
      />
      <CommandList>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <>
            {agents.length > 0 && (
              <CommandGroup heading="Agents">
                {agents.map((agent: Agent) => (
                  <CommandItem
                    key={agent.id}
                    onSelect={() => handleAgentSelect(agent)}
                    className="cursor-pointer"
                  >
                    <GeneratedAvatar
                      seed={agent.name}
                      variant="bottsNeutral"
                      className="mr-2 h-4 w-4"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{agent.name}</span>
                      <span className="text-sm text-muted-foreground truncate max-w-[300px]">
                        {agent.instructions}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            <CommandEmpty>
              {search ? 'No agents found.' : 'Type to search agents...'}
            </CommandEmpty>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
};
