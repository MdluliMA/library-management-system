import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import BookDetail from './pages/BookDetail.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Page and Pine home">
          <span className="brand-mark">P</span><span>PAGE <i>&</i> PINE</span>
        </Link>
        <span className="header-note">A little more wonder, one page at a time.</span>
        <Link className="header-link" to="/">Explore books <span aria-hidden="true">↗</span></Link>
      </header>
      <main><Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="*" element={<div className="state-panel"><h2>Page not found</h2><Link to="/" className="text-link">Return to the catalog</Link></div>} />
      </Routes></main>
      <footer className="site-footer"><span>PAGE & PINE LIBRARY</span><span>Find your next favourite.</span></footer>
    </div>
  );
}
