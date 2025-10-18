import { ChevronLeft, ChevronRight } from "lucide-react";

interface PageButtonProps {
  page?: number;
  children?: React.ReactNode;
  disabled?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
  onPageChange: (page: number) => void;
}

const PageButton = ({
  page,
  children,
  disabled,
  isActive,
  onClick,
}: PageButtonProps) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-2 text-base font-medium
        ${
          disabled
            ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
            : isActive
            ? "bg-primary1 text-white"
            : "cursor-pointer border-stroke bg-white hover:bg-gray-100"
        }`}
  >
    {children ?? page}
  </button>
);

const Pagination = ({
  currentPage,
  totalPages,
  siblingCount = 1,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages: number[] = [];

  const startPage = Math.max(1, currentPage - siblingCount);
  const endPage = Math.min(totalPages, currentPage + siblingCount);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <ul className="text-body-color flex items-center justify-center gap-2">
      <li>
        <PageButton
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft />
        </PageButton>
      </li>
      {startPage > 1 && (
        <>
          <li>
            <PageButton onClick={() => onPageChange(1)} page={1} />
          </li>
          {startPage > 2 && <span className="px-1">...</span>}
        </>
      )}

      {pages.map((page) => (
        <li key={page}>
          <PageButton
            page={page}
            isActive={page === currentPage}
            onClick={() => onPageChange(page)}
          />
        </li>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-1">...</span>}
          <li>
            <PageButton
              onClick={() => onPageChange(totalPages)}
              page={totalPages}
            />
          </li>
        </>
      )}

      <li>
        <PageButton
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight />
        </PageButton>
      </li>
    </ul>
  );
};

export default Pagination;
