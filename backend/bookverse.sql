create table Books(book_id varchar (15),book_title varchar(500),author_name varchar(500),
author_id varchar(500),genre varchar(500),publish_date date,ratings real);
select *from books;

create table Authors(author_id varchar(500) primary key,author_name varchar(500) not null);
MERGE INTO Authors a
USING (SELECT DISTINCT author_id, author_name FROM books) b
ON (a.author_id = b.author_id)
WHEN NOT MATCHED THEN
    INSERT (author_id, author_name) 
    VALUES (b.author_id, b.author_name);
SELECT DISTINCT author_name FROM books;
delete
FROM authors
WHERE author_name LIKE '%,%';
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
