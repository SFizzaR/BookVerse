create sequence book_id_seq START WITH 1 INCREMENT BY 1;
CREATE OR REPLACE TRIGGER book_id_trigger
BEFORE INSERT ON Books
FOR EACH ROW
BEGIN
    :NEW.book_id := book_id_seq.NEXTVAL;
END;
/
create table Books(book_id varchar (15),book_title varchar(500) not null,author_name varchar(500)not null,
author_id varchar(500)not null,genre varchar(500)not null,publish_date date not null,ratings real);
select *from books;
select * from books where book_title='God of Ruin';


create table Authors(author_id varchar(500) primary key,author_name varchar(500) not null);
MERGE INTO Authors a USING (SELECT DISTINCT author_id, author_name FROM books) b ON (a.author_id = b.author_id)
WHEN NOT MATCHED THEN INSERT (author_id, author_name) VALUES (b.author_id, b.author_name);
delete FROM authors WHERE author_name LIKE '%,%';

alter table books add constraint fk foreign key (author_id) references authors(author_id);
select * from authors;

create sequence user_idd_seq START WITH 1 INCREMENT BY 1;
create table Users(user_id number primary key, username varchar(100) not null,email varchar(100) UNIQUE not null, password varchar(100),
role varchar(50) DEFAULT 'unsigned', created_at DATE DEFAULT SYSDATE);
CREATE OR REPLACE TRIGGER user_id_trigger
BEFORE INSERT ON Users
FOR EACH ROW
BEGIN
    :NEW.user_id := user_idd_seq.NEXTVAL;
END;
/
select * from users;

      SELECT b.book_title, b.genre, a.author_name, b.ratings 
      FROM books b 
      JOIN authors a ON b.author_id = a.author_id 
      WHERE 1=1;
      
create sequence list_id_seq START WITH 1 INCREMENT BY 1;
create table ReadingList(list_id number primary key,user_id number ,user_name varchar(100) not null,
book_id varchar (15),book_title varchar(500) not null,author_id varchar(500) not null  ,author_name varchar(500) not null,
status varchar(100)not null);
CREATE OR REPLACE TRIGGER list_id_trigger
BEFORE INSERT ON ReadingList
FOR EACH ROW
BEGIN
    :NEW.list_id := list_id_seq.NEXTVAL;
END;
/
select * from readinglist;
