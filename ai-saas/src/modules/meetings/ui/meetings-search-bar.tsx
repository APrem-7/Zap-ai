'use client';

import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function MeetingsSearchBar() {
  return (
    <div className="w-full max-w-sm">
      <Field className="">
        <FieldLabel
          htmlFor="meeting-search"
          className="text-sm font-medium text-muted-foreground"
        >
          Search for your meetings
        </FieldLabel>

        <div className="relative">
          {/* Search Icon */}
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />

          <Input
            id="meeting-search"
            type="text"
            placeholder="Meeting name, agent, status…"
            className="
              pl-8
              h-8
              bg-white
              border
              rounded-md
              focus-visible:ring-1
              focus-visible:ring-blue-500
              text-sm
            "
          />
        </div>
      </Field>
    </div>
  );
}
