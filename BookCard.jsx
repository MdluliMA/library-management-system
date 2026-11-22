import { Link } from 'react-router-dom';

const covers = ['cover-olive', 'cover-rust', 'cover-blue', 'cover-plum', 'cover-gold'];
export default function BookCard({ book }) {
  const coverClass = covers[Math.abs(Number(book.id) || 0) % covers.length];
  return (
    <article className="book-card">
      <Link to={`/books/${book.id}`} className={`book-cover ${coverClass}`} aria-label={`View ${book.title}`}>
        <span className="cover-kicker">PAGE & PINE</span>
        <span className="cover-title">{book.title}</span>
        <span className="cover-rule" />
        <span className="cover-author">{book.author}</span>
      </Link>
      <div className="book-card-info">
        <span className="book-genre">{book.genre?.name || 'From our collection'}</span>
        <h3><Link to={`/books/${book.id}`}>{book.title}</Link></h3>
        <p>by {book.author}</p>
        <Link className="card-link" to={`/books/${book.id}`}>View book <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}
