'use client';

import { useId, useState } from 'react';

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Search, X, ChevronsUpDownIcon } from 'lucide-react';

export function MeetingsSearchBar() {
  const inputId = useId();
  const descriptionId = useId();
  const statusId = useId();
  const agentNameId = useId();
  // Root cause: All three inputs were sharing the same 'query' state variable
  // Fix: Create separate state for each input to ensure independent control
  const [searchQuery, setSearchQuery] = useState('');
  const [statusQuery, setStatusQuery] = useState('');
  const [agentQuery, setAgentQuery] = useState('');

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
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape' && searchQuery) {
                  setSearchQuery('');
                }
              }}
              placeholder="Search meetings…"
              className="h-9 w-full pl-9 pr-8 text-sm rounded-lg bg-background shadow-sm border border-border/60 focus-visible:ring-2 focus-visible:ring-ring/20"
            />

            {searchQuery.length > 0 && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setSearchQuery('');
                }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="relative flex-1">
            <ChevronsUpDownIcon className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id={statusId}
              type="search"
              aria-describedby={descriptionId}
              value={statusQuery}
              onChange={(e) => {
                setStatusQuery(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape' && statusQuery) {
                  setStatusQuery('');
                }
              }}
              placeholder="Status"
              className="h-9 w-full pl-9 pr-8 text-sm rounded-lg bg-background shadow-sm border border-border/60 focus-visible:ring-2 focus-visible:ring-ring/20"
            />
          </div>
          <div className="relative flex-1">
            <ChevronsUpDownIcon className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id={agentNameId}
              type="agentName"
              aria-describedby={descriptionId}
              value={agentQuery}
              onChange={(e) => {
                setAgentQuery(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape' && agentQuery) {
                  setAgentQuery('');
                }
              }}
              placeholder="Agent"
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
