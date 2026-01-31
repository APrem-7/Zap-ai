'use client';

import { useEffect, useState } from 'react';
import { SearchAgents } from '@/app/api/agents/agents';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronsUpDownIcon, Bot, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { GeneratedAvatar } from '@/components/generated-avatar';

interface Agent {
  id: string;
  name: string;
  instructions: string;
}

interface AgentDropdownProps {
  selectedAgentId: string;
  onAgentChange: (agentId: string) => void;
}

export function AgentDropdown({
  selectedAgentId,
  onAgentChange,
}: AgentDropdownProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedAgent = agents.find((agent) => agent.id === selectedAgentId);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await SearchAgents(); // Use SearchAgents without parameters to get all agents
        setAgents(response.data || []);
      } catch (err) {
        setError('Failed to load agents');
        console.error('Error loading agents:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, []);

  if (loading) {
    return (
      <div className="relative flex-1">
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex-1">
        <Button
          variant="outline"
          className="h-9 w-full justify-between text-left font-normal text-destructive"
          disabled
        >
          <span>{error}</span>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative flex-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-9 w-full justify-between text-left font-normal"
          >
            <div className="flex items-center">
              {selectedAgent ? (
                <>
                  <GeneratedAvatar
                    seed={selectedAgentId}
                    variant="bottsNeutral"
                    className="mr-2 h-4 w-4 text-muted-foreground"
                  />
                  <span className="text-muted-foreground">
                    {selectedAgent.name}
                  </span>
                </>
              ) : (
                <>
                  <GeneratedAvatar
                    seed={selectedAgentId}
                    variant="bottsNeutral"
                    className="mr-2 h-4 w-4 text-muted-foreground"
                  />
                  <span className="text-muted-foreground">Select Agent</span>
                </>
              )}
            </div>
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          {agents.map((agent) => (
            <DropdownMenuItem
              key={agent.id}
              onClick={() => onAgentChange(agent.id)}
              className="flex items-center cursor-pointer"
            >
              <GeneratedAvatar
                seed={agent.id}
                variant="bottsNeutral"
                className="mr-2 h-4 w-4 text-muted-foreground"
              />
              {agent.name}
              {selectedAgentId === agent.id && (
                <div className="ml-auto w-4 h-4 flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
              )}
            </DropdownMenuItem>
          ))}
          {/* Add separator and clear option */}
          {agents.length > 0 && <div className="border-t my-1" />}
          <DropdownMenuItem
            onClick={() => onAgentChange('')}
            className="flex items-center cursor-pointer text-muted-foreground"
          >
            <X className="mr-2 h-4 w-4" />
            Clear Agent
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
