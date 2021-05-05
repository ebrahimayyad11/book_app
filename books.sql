DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    descriptions TEXT,
    img VARCHAR(255),
    ISBN VARCHAR(255)
  );


-- DROP TABLE IF EXISTS authors;

-- CREATE TABLE authors (
--     id SERIAL PRIMARY KEY,
--     author VARCHAR(255)
--   );

  