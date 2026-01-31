import { useQueryStates } from 'nuqs';
import { parseAsInteger, parseAsString } from 'nuqs';
import { z } from 'zod';
import { meetingQuerySchema } from '../schema';

// Extract types from existing schema
type MeetingStatus =
  | 'upcoming'
  | 'active'
  | 'completed'
  | 'processing'
  | 'cancelled';
type MeetingQuery = z.infer<typeof meetingQuerySchema>;

export const useMeetingsFilters = () => {
  const [filters, setFilters] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
    search: parseAsString.withDefault('').withOptions({
      throttleMs: 300, // Built-in debouncing with nuqs
      clearOnDefault: true,
    }),
    status: parseAsString.withDefault('').withOptions({
      throttleMs: 300,
      clearOnDefault: true,
    }),
    agentId: parseAsString.withDefault('').withOptions({
      throttleMs: 300,
      clearOnDefault: true,
    }),
  });

  const setPage = (page: number) => setFilters((prev) => ({ ...prev, page }));
  const setPageSize = (pageSize: number) =>
    setFilters((prev) => ({ ...prev, pageSize }));
  const setSearch = (search: string) =>
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  const setStatus = (status: string) =>
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  const setAgentId = (agentId: string) =>
    setFilters((prev) => ({ ...prev, agentId, page: 1 }));

  const resetFilters = () =>
    setFilters({
      page: 1,
      pageSize: 10,
      search: '',
      status: '',
      agentId: '',
    });

  return {
    ...filters,
    setPage,
    setPageSize,
    setSearch,
    setStatus,
    setAgentId,
    resetFilters,
  };
};
