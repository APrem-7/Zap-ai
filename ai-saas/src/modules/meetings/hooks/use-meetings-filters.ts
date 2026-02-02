import { useQueryStates } from 'nuqs';
import { parseAsInteger, parseAsString } from 'nuqs';
import { z } from 'zod';
import { meetingQuerySchema } from '../schema';
import { useDebouncedValue } from '@/hooks/use-debounce-value';

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
      clearOnDefault: true,
    }),
    status: parseAsString.withDefault('').withOptions({
      clearOnDefault: true,
    }),
    agentId: parseAsString.withDefault('').withOptions({
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

  // Combine filter values into a single object for debouncing
  // This prevents race conditions by debouncing the entire filters object
  const filterObject = {
    search: filters.search,
    status: filters.status,
    agentId: filters.agentId,
  };

  // Debounce the entire filters object to prevent race conditions
  // This ensures only ONE query runs after filters settle for 300ms
  const debouncedFilters = useDebouncedValue(filterObject, 300);

  return {
    page: filters.page,
    pageSize: filters.pageSize,
    search: filters.search,
    status: filters.status,
    agentId: filters.agentId,
    // Expose debounced filters for React Query
    debouncedFilters,
    setPage,
    setPageSize,
    setSearch,
    setStatus,
    setAgentId,
    resetFilters,
  };
};
