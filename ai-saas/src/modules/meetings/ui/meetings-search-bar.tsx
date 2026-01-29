'use client';

import { useId, useState } from 'react';

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

export function MeetingsSearchBar() {
  const inputId = useId();
  const descriptionId = useId();
  const [query, setQuery] = useState('');

  return (
    <div className="w-full max-w-xs sm:max-w-sm">
      <Field className="gap-0">
        <FieldLabel htmlFor={inputId} className="sr-only">
          Search meetings
        </FieldLabel>

        <div className="relative">
          {/* Search Icon */}
          <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            id={inputId}
            type="search"
            aria-describedby={descriptionId}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && query) {
                setQuery('');
              }
            }}
            placeholder="Search meetings…"
            className="h-9 pl-9 pr-8 text-sm rounded-lg bg-background shadow-sm border border-border/60 focus-visible:ring-2 focus-visible:ring-ring/20"
          />

          {query.length > 0 && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery('');
              }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <FieldDescription id={descriptionId} className="sr-only">
          Matches meeting name, agent, and status.
        </FieldDescription>
      </Field>
    </div>
  );
}
