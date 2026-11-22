import { useEffect, useState } from 'react';
import api from '../api.js';
import BookCard from './BookCard.jsx';

function SkeletonCard() {
  return <div className="skeleton-card" aria-hidden="true"><div className="skeleton-cover shimmer"/><div className="skeleton-line shimmer"/><div className="skeleton-line short shimmer"/><div className="skeleton-line tiny shimmer"/></div>;
}

export default function BookGrid({ genreId, search, sortBy }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    async function loadBooks() {
      setLoading(true);
      setError('');
      try {
        const params = { page: 1, limit: 100 };
        if (genreId) params.genreId = genreId;
        if (search) params.search = search;
        const response = await api.get('/books', { params, signal: controller.signal });
        const payload = response.data;
        const rows = Array.isArray(payload) ? payload : (payload?.data ?? []);
        if (active) setBooks(rows);
      } catch (err) {
        if (active && err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
          setError(err.response?.data?.message || 'We could not load the catalog. Please check your connection and try again.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadBooks();
    return () => { active = false; controller.abort(); };
  }, [genreId, search, retry]);

  const visibleBooks = [...books].sort((a, b) => {
    if (!sortBy) return 0;
    return String(a[sortBy] || '').localeCompare(String(b[sortBy] || ''), undefined, { sensitivity: 'base' });
  });

  if (loading) return <div className="book-grid" aria-label="Loading books">{Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}</div>;
  if (error) return <div className="state-panel error-panel"><span className="state-icon">!</span><h2>Catalog unavailable</h2><p>{error}</p><button className="button button-dark" onClick={() => setRetry((n) => n + 1)}>Try again</button></div>;
  if (!visibleBooks.length) return <div className="state-panel"><span className="state-icon">⌕</span><h2>No books found</h2><p>Try another title, author, or genre. Your next read might be just around the corner.</p></div>;

  return <div className="book-grid">{visibleBooks.map((book) => <BookCard key={book.id} book={book} />)}</div>;
}
