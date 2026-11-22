# Library Management System — React client

Patron-facing catalog built with React, Vite, Axios, and React Router.

## Run locally

1. Start the NestJS API on port 3000.
2. From this `client` directory run `npm install`.
3. Ensure `.env` contains `VITE_API_URL=http://localhost:3000`.
4. Run `npm run dev` and open the URL Vite prints (usually http://localhost:5173).

## API contract used

- `GET /books?genreId=&search=&page=1&limit=100` — accepts either a raw array or the backend's `{ data, pagination }` response.
- `GET /books/:id` — returns one book, including its `genre` relation.
- `GET /genres` — returns the available genres.

The current backend implementation returns a paginated object for `/books`; this client reads its `data` array. Search and genre filtering are sent to the server. Sorting by title or author is applied to the currently fetched result set in the browser.

## Included features

- Responsive book-card grid and individual book detail route.
- Genre filter and 400ms debounced title/author search.
- Loading skeletons, API error state with retry, and no-results state.
- Optional client-side sort by title or author.
