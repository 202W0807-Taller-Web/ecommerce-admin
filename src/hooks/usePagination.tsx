import { useState } from "react";

function usePagination(initialPage: number = 1) {
  const [page, setPage] = useState<number>(initialPage);

  const goToPage = (pageNumber: number) => {
    setPage(() => Math.max(1, Math.min(pageNumber, Number.MAX_SAFE_INTEGER)));
  };

  return { page, setPage: goToPage };
}

export default usePagination;
