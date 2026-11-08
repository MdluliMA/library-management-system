import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Upsert makes the genre setup safe to run more than once.
  const genreData = [
    { name: 'Fiction', description: 'Novels and imaginative stories.' },
    { name: 'Science', description: 'Scientific ideas, discoveries, and research.' },
    { name: 'History', description: 'Historical events and biographies.' },
    { name: 'Technology', description: 'Computing, software, and modern technology.' },
  ];

  const genres = new Map<string, number>();

  for (const genre of genreData) {
    const savedGenre = await prisma.genre.upsert({
      where: { name: genre.name },
      update: { description: genre.description },
      create: genre,
    });
    genres.set(savedGenre.name, savedGenre.id);
  }

  const fictionId = genres.get('Fiction')!;
  const scienceId = genres.get('Science')!;
  const historyId = genres.get('History')!;
  const technologyId = genres.get('Technology')!;

  const books = [
    // Fiction
    { title: 'Things Fall Apart', author: 'Chinua Achebe', isbn: '9780000000001', publishedYear: 1958, genreId: fictionId },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780000000002', publishedYear: 1925, genreId: fictionId },
    { title: '1984', author: 'George Orwell', isbn: '9780000000003', publishedYear: 1949, genreId: fictionId },
    { title: 'Animal Farm', author: 'George Orwell', isbn: '9780000000004', publishedYear: 1945, genreId: fictionId },

    // Science
    { title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '9780000000005', publishedYear: 1988, genreId: scienceId },
    { title: 'The Selfish Gene', author: 'Richard Dawkins', isbn: '9780000000006', publishedYear: 1976, genreId: scienceId },
    { title: 'Cosmos', author: 'Carl Sagan', isbn: '9780000000007', publishedYear: 1980, genreId: scienceId },
    { title: 'The Origin of Species', author: 'Charles Darwin', isbn: '9780000000008', publishedYear: 1859, genreId: scienceId },

    // History
    { title: 'Long Walk to Freedom', author: 'Nelson Mandela', isbn: '9780000000009', publishedYear: 1994, genreId: historyId },
    { title: 'The Art of War', author: 'Sun Tzu', isbn: '9780000000010', publishedYear: null, genreId: historyId },
    { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', isbn: '9780000000011', publishedYear: 1997, genreId: historyId },
    { title: 'The Diary of a Young Girl', author: 'Anne Frank', isbn: '9780000000012', publishedYear: 1947, genreId: historyId },

    // Technology
    { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780000000013', publishedYear: 2008, genreId: technologyId },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt and David Thomas', isbn: '9780000000014', publishedYear: 1999, genreId: technologyId },
    { title: 'Code', author: 'Charles Petzold', isbn: '9780000000015', publishedYear: 1999, genreId: technologyId },
  ];

  // ISBN is unique, so skipDuplicates prevents duplicate books on repeated runs.
  await prisma.book.createMany({
    data: books,
    skipDuplicates: true,
  });

  const [genreCount, bookCount] = await Promise.all([
    prisma.genre.count(),
    prisma.book.count(),
  ]);

  console.log(`Seed complete: ${genreCount} genres and ${bookCount} books in the database.`);
}

main()
  .catch((error: unknown) => {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
