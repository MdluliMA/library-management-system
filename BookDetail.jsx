import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api.js';

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setLoading(true); setError(''); setBook(null);
    api.get(`/books/${id}`, { signal: controller.signal })
      .then(({ data }) => { if (active) setBook(data); })
      .catch((err) => { if (active && err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') setError(err.response?.data?.message || 'We could not find this book.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, [id]);

  if (loading) return <div className="detail-state"><div className="detail-skeleton shimmer"/><div className="detail-skeleton-copy"><div className="skeleton-line shimmer"/><div className="skeleton-line short shimmer"/><div className="skeleton-line shimmer"/></div></div>;
  if (error || !book) return <div className="state-panel detail-message"><span className="state-icon">!</span><h2>Book unavailable</h2><p>{error || 'This book could not be found.'}</p><Link className="button button-dark" to="/">Back to catalog</Link></div>;

  return (
    <section className="detail-page">
      <Link to="/" className="back-link">← Back to the collection</Link>
      <div className="detail-layout">
        <div className={`detail-cover cover-${['olive','rust','blue','plum','gold'][Math.abs(Number(book.id) || 0) % 5]}`}><span className="cover-kicker">PAGE & PINE</span><span className="cover-title">{book.title}</span><span className="cover-rule"/><span className="cover-author">{book.author}</span></div>
        <div className="detail-copy"><span className="eyebrow">{book.genre?.name || 'FROM OUR COLLECTION'}</span><h1>{book.title}</h1><p className="detail-author">by {book.author}</p>
          <p className="detail-intro">A new chapter is waiting. Discover this title from our collection and find a little time to get lost in a good story.</p>
          <div className="book-facts">
            <div><span>AUTHOR</span><strong>{book.author}</strong></div>
            <div><span>GENRE</span><strong>{book.genre?.name || 'Not specified'}</strong></div>
            <div><span>YEAR PUBLISHED</span><strong>{book.publishedYear || 'Not specified'}</strong></div>
            <div><span>ISBN</span><strong>{book.isbn || 'Not specified'}</strong></div>
            {book.totalCopies !== undefined && <div><span>TOTAL COPIES</span><strong>{book.totalCopies}</strong></div>}
          </div>
          <Link to="/" className="button button-dark">Continue exploring <span>→</span></Link>
        </div>
      </div>
    </section>
  );
}
