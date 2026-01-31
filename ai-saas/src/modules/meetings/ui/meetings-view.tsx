'use client';
//so now here for temporarily we are going to add the Data from the backend so that we can show the data

import { getMeetings } from '@/app/api/agents/meetings';
import { useQuery } from '@tanstack/react-query';
import { MeetingResponse } from '@/modules/meetings/schema';
import { columns } from '../components/columns';
import { DataTable } from '../components/data-table';
import { EmptyState } from '@/components/empty-state';
import { useRouter } from 'next/navigation';
import { useMeetingsFilters } from '../hooks/use-meetings-filters';

import { DataPagination } from '@/modules/agents/ui/components/data-pagination';

import { z } from 'zod';

import { LoadingState } from '@/components/loading-state';
import { ErrorState } from '@/components/error-state';

export const MeetingView = () => {
  const router = useRouter();
  const { page, pageSize, search, status, agentName, setPage } =
    useMeetingsFilters();

  const { data, isLoading, error } = useQuery({
    queryKey: ['meetings', page, pageSize, search, status, agentName],
    queryFn: () => {
      console.log('🌐 CLIENT fetching meetings in useQuery');
      return getMeetings(page, pageSize, search, status, agentName);
    },
    staleTime: 5 * 60 * 1000, // ✅ 5 minutes - data is fresh
    gcTime: 10 * 60 * 1000, // ✅ 10 minutes - keep in memory
  });

  if (isLoading) {
    return (
      <LoadingState
        title="Loading meetings"
        description="Please wait while we fetch the meetings"
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Error loading meetings"
        description={error?.message || 'Please try again'}
      />
    );
  }

  return (
    <div className="animate-fade-smooth">
      <DataTable
        data={data?.data || []}
        columns={columns}
        onRowClick={(row) => {
          router.push(`/meetings/${row.id}`);
        }}
      />
      {data?.data && data.data.length === 0 && (
        <div className="animate-slide-up">
          <EmptyState
            title="No meetings found"
            description="Please create a meeting to get started"
          />
        </div>
      )}
      <DataPagination
        page={page}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
      />
    </div>
  );
};
