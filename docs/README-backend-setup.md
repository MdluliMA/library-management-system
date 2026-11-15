# Backend core setup

This package provides Genre CRUD, Book listing/filtering/pagination and librarian-only Book writes, JWT registration/login, user profile, DTO validation and login rate limiting.

## Install dependencies

Run inside `api/`:

```bash
npm install @nestjs/config @nestjs/jwt @nestjs/passport @nestjs/throttler passport passport-jwt bcrypt class-validator class-transformer
npm install -D @types/bcrypt @types/passport-jwt
```

Use a NestJS-compatible `@nestjs/throttler` release. This implementation uses the current array-based `ThrottlerModule.forRoot` configuration and named `default` throttle metadata.

## Environment

Copy `.env.example` to `.env`, then set your PostgreSQL `DATABASE_URL` and a strong random `JWT_SECRET`. Do not commit `.env`.

## Prisma schema and migration

The included schema expects PostgreSQL and defines `Role`, `User.passwordHash`, `Genre`, and `Book.totalCopies` plus the Genre foreign-key relation.

From `api/`:

```bash
npx prisma generate
npx prisma migrate dev --name backend_core
```

## Run

```bash
npm run start:dev
```

## Authorization

- Public: `GET /genres`, `GET /genres/:id`, `GET /books`, `GET /books/:id`, `POST /auth/register`, `POST /auth/login`.
- Genre CRUD writes are implemented as requested; they are not role-restricted by this brief.
- `POST /books`, `PATCH /books/:id`, and `DELETE /books/:id` require `Authorization: Bearer <JWT>` and a user whose database role is `LIBRARIAN`.
- Registration always creates a `PATRON`. Promote a trusted account to `LIBRARIAN` through a controlled database/admin process; never accept role from public registration.
- Login is limited to 5 requests per 60 seconds per client IP.
- `GET /users/profile` requires a valid JWT and returns the authenticated user attached by Passport.

## Book list query parameters

`GET /books?genreId=2&search=achebe&page=1&limit=10`

- `genreId`: optional positive integer.
- `search`: optional case-insensitive match against title or author.
- `page`: optional positive integer; defaults to 1.
- `limit`: optional positive integer; defaults to 10 and is capped at 100.

## Postman

Import `docs/postman_collection.json`. Set `baseUrl` and `accessToken` collection variables. For protected book write requests, `accessToken` must belong to a LIBRARIAN account.
