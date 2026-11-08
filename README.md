# Library Management System — Data Layer

This repository contains the Prisma data layer for a library catalog using PostgreSQL.

## Technology

- NestJS
- Prisma ORM
- PostgreSQL

## Data models

- **User** stores library accounts. The `Role` enum restricts roles to `PATRON` or `LIBRARIAN`.
- **Genre** stores each genre once.
- **Book** stores catalog information and references one Genre through `genreId`.
- **Review** is an optional extension. It connects a User to a Book and stores a rating and optional comment. A user can review a particular book only once.

## Schema Decisions

The `Book` model references `Genre` through the `genreId` foreign key instead of embedding the genre name and description in every book record.

This relational design has several advantages:

1. **Less duplicated data:** a genre name and description are stored once, even when many books belong to that genre.
2. **Consistency:** the foreign key ensures that a book points to an existing genre.
3. **Simpler updates:** changing a genre's description does not require updating every book in that genre.
4. **Useful queries:** the relation makes it straightforward to retrieve all books belonging to a genre.

The relationship is one-to-many: one Genre can have many Books, while each Book belongs to one Genre.

## Prisma vs. a document database

One difference I noticed is that in Prisma with a relational database, I define the relationship explicitly using a foreign-key field (`genreId`) and `@relation`. In a document database, I could instead embed genre details inside each book document. The relational approach avoids repeating genre information and provides database-enforced referential integrity.

## Setup

Run these commands from the `api` directory.

1. Install dependencies:

   ```bash
   npm install
   npm install prisma @prisma/client
   npm install --save-dev ts-node
   ```

2. Create your local environment file by copying `.env.example` to `.env`, then replace the placeholder with your hosted PostgreSQL connection string. Never commit `.env`.

3. Generate Prisma Client:

   ```bash
   npx prisma generate
   ```

4. Create and apply the initial migration:

   ```bash
   npx prisma migrate dev --name init
   ```

5. Configure the seed command in `api/package.json` (merge this into the existing package.json; do not replace the whole file):

   ```json
   {
     "prisma": {
       "seed": "ts-node prisma/seed.ts"
     }
   }
   ```

6. Run the seed:

   ```bash
   npx prisma db seed
   ```

7. Inspect the data:

   ```bash
   npx prisma studio
   ```

For a deployment/production environment, apply committed migrations with:

```bash
npx prisma migrate deploy
```

## Seed data

The seed script creates or updates four genres and inserts fifteen books, distributed across all four genres. It uses genre `upsert` and book `skipDuplicates` so it can be run again without creating duplicate genres or ISBN records.

The ISBN values in the sample seed data are placeholder unique identifiers for this assignment, not verified real-world ISBNs.

## Notes

- `passwordHash` is used instead of storing a plaintext password. Hash passwords in the application before saving them.
- The `Review.rating` range (for example, 1–5) should also be validated in the application.
- The optional Review model is included as the assignment's stretch task.
