create table Authors(author_id varchar(20) primary key,author_name varchar(75) not null);
select * from authors;
create table Books(book_id varchar (15),book_title varchar(500),author_name varchar(500),
author_id varchar(500),genre varchar(500),publish_date date,ratings real);
select *from books;
