import { useCallback, useEffect, useState } from 'react';
import api from '../api.js';
import BookGrid from '../components/BookGrid.jsx';
import SearchBar from '../components/SearchBar.jsx';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [genreId, setGenreId] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [genres, setGenres] = useState([]);
  const [genreError, setGenreError] = useState('');
  const handleSearch = useCallback((value) => setSearch(value), []);

  useEffect(() => {
    let active = true;
    api.get('/genres').then(({ data }) => {
      if (active) setGenres(Array.isArray(data) ? data : (data?.data ?? []));
    }).catch(() => { if (active) setGenreError('Genre options could not be loaded.'); });
    return () => { active = false; };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-copy"><span className="eyebrow">THE JOY OF DISCOVERY</span>
          <h1>Find a story<br/><em>worth staying up for.</em></h1>
          <p>Thoughtful reads, timeless voices, and new worlds waiting to be opened. Find your next favourite in our library.</p>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="sun-disc"/><div className="art-book book-one"/><div className="art-book book-two"/><div className="art-book book-three"/><span className="art-caption">A WORLD<br/>IN EVERY<br/>BOOK.</span></div>
      </section>
      <section className="catalog-section">
        <div className="section-heading"><div><span className="eyebrow">A SHELF FULL OF POSSIBILITIES</span><h2>Explore the collection</h2></div><span className="section-aside">Good things begin with a first page.</span></div>
        <div className="catalog-toolbar">
          <SearchBar onSearch={handleSearch} />
          <div className="toolbar-controls">
            <label className="select-wrap"><span className="control-label">GENRE</span><select value={genreId} onChange={(e) => setGenreId(e.target.value)} aria-label="Filter by genre"><option value="">All genres</option>{genres.map((genre) => <option key={genre.id} value={genre.id}>{genre.name}</option>)}</select></label>
            <label className="select-wrap"><span className="control-label">SORT BY</span><select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort books"><option value="">Featured</option><option value="title">Title</option><option value="author">Author</option></select></label>
          </div>
        </div>
        {genreError && <p className="inline-note">{genreError}</p>}
        <BookGrid genreId={genreId} search={search} sortBy={sortBy} />
      </section>
    </>
  );
}
