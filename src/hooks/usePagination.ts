import { useCallback, useEffect, useMemo, useState } from "react";

export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  // if items shrink (delete, toggle, clear), pull the stored page back in range
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(
    () => items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [items, currentPage, pageSize],
  );

  const goTo = useCallback(
    (next: number) => setPage(Math.min(Math.max(1, next), totalPages)),
    [totalPages],
  );

  return { page: currentPage, totalPages, pageItems, goTo };
}
