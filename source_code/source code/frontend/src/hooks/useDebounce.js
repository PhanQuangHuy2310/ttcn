// src/hooks/useDebounce.js
// PHASE 4: Debounce hook for search inputs — prevents excessive API calls

import { useState, useEffect } from 'react';

/**
 * Returns a debounced version of value that only updates
 * after `delay` ms of no changes.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(search, 300);
 *   useEffect(() => { fetchResults(debouncedSearch); }, [debouncedSearch]);
 */
export const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

// src/hooks/usePagination.js
// PHASE 4: Pagination helper for large tables

export const usePagination = (data = [], pageSize = 20) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const start      = (safePage - 1) * pageSize;
  const pageData   = data.slice(start, start + pageSize);

  return {
    page:       safePage,
    totalPages,
    pageData,
    setPage,
    hasPrev:    safePage > 1,
    hasNext:    safePage < totalPages,
    prev:       () => setPage(p => Math.max(1, p - 1)),
    next:       () => setPage(p => Math.min(totalPages, p + 1)),
    reset:      () => setPage(1),
    start:      start + 1,
    end:        Math.min(start + pageSize, data.length),
    total:      data.length,
  };
};
