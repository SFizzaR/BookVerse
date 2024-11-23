--books table
create sequence book_id_seq START WITH 1 INCREMENT BY 1;
CREATE OR REPLACE TRIGGER book_id_trigger
BEFORE INSERT ON Books
FOR EACH ROW
BEGIN
    :NEW.book_id := book_id_seq.NEXTVAL;
END;
/
create table Books(book_id varchar (15),book_title varchar(500) not null,author_name varchar(500)not null,
author_id varchar(500)not null,genre varchar(500)not null,publish_date date not null,ratings real,book_image_url varchar(1000));
select *from books;

--Authors
create table Authors(author_id varchar(500) primary key,author_name varchar(500) not null);
MERGE INTO Authors a USING (SELECT DISTINCT author_id, author_name FROM books) b ON (a.author_id = b.author_id)
WHEN NOT MATCHED THEN INSERT (author_id, author_name) VALUES (b.author_id, b.author_name);
delete FROM authors WHERE author_name LIKE '%,%';

alter table books add constraint fk foreign key (author_id) references authors(author_id);
select * from authors;

--users
create sequence user_idd_seq START WITH 1 INCREMENT BY 1;
create table Users(user_id number primary key, username varchar(100) not null,email varchar(100) UNIQUE not null, PASSWORD varchar(100),
role varchar(50) DEFAULT 'unsigned', created_at DATE DEFAULT SYSDATE);
CREATE OR REPLACE TRIGGER user_id_trigger
BEFORE INSERT ON Users
FOR EACH ROW
BEGIN
    :NEW.user_id := user_idd_seq.NEXTVAL;
END;
/
select * from users; 
--alter table users add badges varchar(50);

--reading list      
create sequence list_id_seq START WITH 1 INCREMENT BY 1;
create table ReadingList(list_id number primary key,user_id number ,username varchar(100) not null,
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
select count(user_id) from readinglist where user_id=8 and status='Read';
--Badges
create sequence badge_id_seq START WITH 1 INCREMENT BY 1;
CREATE TABLE Badges (badge_id number  PRIMARY KEY,badge_name VARCHAR(50) NOT NULL UNIQUE,badge_icon VARCHAR(255),
criteria INT NOT NULL);
CREATE OR REPLACE TRIGGER badge_id_seq
BEFORE INSERT ON Badges
FOR EACH ROW
BEGIN
    :NEW.badge_id := badge_id_seq.NEXTVAL;
END;
/

insert into badges(badge_name,badge_icon,criteria) values('Beginner','C:\Users\HP\Documents\ZahabUniWork\5thSemester\DB_Project\sql\beginner.jpeg',5);
insert into badges(badge_name,badge_icon,criteria) values('Silver','C:\Users\HP\Documents\ZahabUniWork\5thSemester\DB_Project\sql\silver-badge.jpeg',15);
insert into badges(badge_name,badge_icon,criteria) values('Gold','C:\Users\HP\Documents\ZahabUniWork\5thSemester\DB_Project\sql\gold-badge.jpeg',30);
insert into badges(badge_name,badge_icon,criteria) values('Expert','C:\Users\HP\Documents\ZahabUniWork\5thSemester\DB_Project\sql\expert-badge.jpeg',50);
insert into badges(badge_name,badge_icon,criteria) values('Master','C:\Users\HP\Documents\ZahabUniWork\5thSemester\DB_Project\sql\master-badge.jpeg',100);
select * from badges;

--badge history, to keep track of earned badges
create sequence badge_history_id;
CREATE TABLE BadgeHistory (
    history_id number PRIMARY KEY,
    user_id number NOT NULL,
    username varchar(100) not null,
    badge_id number NOT NULL,          
    earned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_badge FOREIGN KEY (badge_id) REFERENCES Badges(badge_id) ON DELETE CASCADE
);
CREATE OR REPLACE TRIGGER badge_history_id
BEFORE INSERT ON BadgeHistory
FOR EACH ROW
BEGIN
    :NEW.history_id := badge_history_id.NEXTVAL;
END;
/

select * from badgeHistory;
