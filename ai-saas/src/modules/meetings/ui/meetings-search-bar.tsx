'use client';

import { useId } from 'react';

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Search,
  X,
  ChevronsUpDownIcon,
  Calendar,
  CheckCircle,
  PlayCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface MeetingsSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  agentId: string;
  onAgentIdChange: (value: string) => void;
}

const statusOptions = [
  { value: 'upcoming', label: 'Upcoming', icon: Calendar },
  { value: 'completed', label: 'Completed', icon: CheckCircle },
  { value: 'active', label: 'Active', icon: PlayCircle },
  { value: 'processing', label: 'Processing', icon: Clock },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle },
];

export function MeetingsSearchBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  agentId,
  onAgentIdChange,
}: MeetingsSearchBarProps) {
  const inputId = useId();
  const descriptionId = useId();
  const statusId = useId();
  const agentIdId = useId();

  const selectedStatus = statusOptions.find(
    (option) => option.value === status
  );

  return (
    <div className="w-full">
      <Field className="gap-0">
        <FieldLabel htmlFor={inputId} className="sr-only">
          Search meetings
        </FieldLabel>
        <div className="flex flex-row gap-x-2 w-full max-w-2xl">
          <div className="relative flex-1">
            {/* Search Icon */}
            <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <Input
              id={inputId}
              type="search"
              aria-describedby={descriptionId}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape' && search) {
                  onSearchChange('');
                }
              }}
              placeholder="Search meetings…"
              className="h-9 w-full pl-9 pr-8 text-sm rounded-lg bg-background shadow-sm border border-border/60 focus-visible:ring-2 focus-visible:ring-ring/20"
            />

            {search.length > 0 && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => onSearchChange('')}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="relative flex-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 w-full justify-between text-left font-normal"
                  id={statusId}
                >
                  <div className="flex items-center">
                    {selectedStatus ? (
                      <>
                        <selectedStatus.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {selectedStatus.label}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">Status</span>
                    )}
                  </div>
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onStatusChange(option.value)}
                    className="flex items-center cursor-pointer"
                  >
                    <option.icon className="mr-2 h-4 w-4" />
                    {option.label}
                    {status === option.value && (
                      <div className="ml-auto w-4 h-4 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      </div>
                    )}
                  </DropdownMenuItem>
                ))}
                {/* Add separator and clear option */}
                <div className="border-t my-1" />
                <DropdownMenuItem
                  onClick={() => onStatusChange('')}
                  className="flex items-center cursor-pointer text-muted-foreground"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear Status
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="relative flex-1">
            <ChevronsUpDownIcon className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id={agentIdId}
              type="agentId"
              aria-describedby={descriptionId}
              value={agentId}
              onChange={(e) => onAgentIdChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape' && agentId) {
                  onAgentIdChange('');
                }
              }}
              placeholder="Agent ID"
              className="h-9 w-full pl-9 pr-8 text-sm rounded-lg bg-background shadow-sm border border-border/60 focus-visible:ring-2 focus-visible:ring-ring/20"
            />
          </div>
        </div>

        <FieldDescription id={descriptionId} className="sr-only">
          Matches meeting name, agent, and status.
        </FieldDescription>
      </Field>
    </div>
  );
}
