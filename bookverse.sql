create table Books(book_id varchar (15),book_title varchar(500),author_name varchar(500),
author_id varchar(500),genre varchar(500),publish_date date,ratings real);
select *from books;
create table Authors(author_id varchar(500) primary key,author_name varchar(500) not null);
drop table authors;
select * from authors;
INSERT INTO Authors (author_id, author_name) SELECT DISTINCT author_id, author_name FROM books;
SELECT DISTINCT author_name FROM books;
