import React, { useRef } from 'react';
import './section.css';  // Assuming you have a separate CSS file for styling

function Section({ title, id, books }) {
  const scrollRef = useRef(null);

  return (
    <div>
      <h3 className="description">{title}</h3>
      <div style={{ position: 'relative' }}>
        <div className="book-list" id={id} ref={scrollRef}>
          {books.map((book) => (
            <div className="book" key={book.id}>
              <a href={`book${book.id}.html`}>
                <img src={book.image} alt={book.title} />
                <p>{book.title}</p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Section;
