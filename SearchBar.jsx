import { useEffect, useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => onSearch(query.trim()), 400);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <label className="search-box">
      <span className="search-icon" aria-hidden="true">⌕</span>
      <input value={query} onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by title or author..." aria-label="Search books by title or author" />
      {query && <button className="clear-search" type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
    </label>
  );
}
