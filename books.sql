DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    descriptions TEXT,
    img VARCHAR(255),
    ISBN VARCHAR(255),
    categories VARCHAR(255)
  );