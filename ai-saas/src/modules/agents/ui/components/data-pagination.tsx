import { Button } from "@/components/ui/button";

interface DataPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const DataPagination = ({
  page,
  totalPages,
  onPageChange,
}: DataPaginationProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}>
            Previous
        </Button>
        <Button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
            Next
        </Button>

      </div>
    </div>
  );
};
