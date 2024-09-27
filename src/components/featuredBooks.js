import React, { useState, useEffect } from 'react';
import './featuredBooks.css'; // Assuming you have a separate CSS file for styling

// Array of books data
const books = [
  { title: "The Seven Husbands of Evelyn Hugo", summary: "A heartwarming and engaging novel about love, identity, and the power of storytelling.", image: "https://assets.vogue.com/photos/62dadd5b903af959e205f745/1:1/w_1398,h_1398,c_limit/the-seven-husbands-of-evelyn-hugo-9781501161933_hr.jpeg" },
  { title: "The Silent Patient", summary: "A psychological thriller about a famous painter who shoots her husband and refuses to speak, and the psychotherapist who becomes obsessed with uncovering her secrets.", image: "https://book-shelf.pk/cdn/shop/files/383765699_972040427418031_3870065130882927535_n.jpg?v=1695575089" },
  { title: "The Three-Body Problem", summary: "An award-winning novel that explores the first contact between humans and an alien civilization, set against the backdrop of China's Cultural Revolution.", image: "https://m.media-amazon.com/images/I/818l7Ujz5-L._AC_UF1000,1000_QL80_.jpg" },
  { title: "Sapiens: A Brief History of Humankind", summary: "A sweeping narrative that covers the entire history of humankind, from the emergence of Homo sapiens in Africa to the present day.", image: "https://www.libertybooks.com/image/cache/01%20ZEESHAN/1-100/Sapiens-A-Brief-History-of-Humankind-640x996.jpg?q6" },
  { title: "The Night Circus", summary: "A magical and imaginative tale about a competition between two young illusionists who are bound together by a magical contract, set against the backdrop of a mysterious and enchanting circus.", image: "https://www.libertybooks.com/image/cache/catalog/9780099554790-640x996.jpg?q6" },
];

// Main FeaturedBooks Component
const FeaturedBooks = () => {
  const [featuredBookIndex, setFeaturedBookIndex] = useState(0); // State to track the featured book

  // Automatically change the featured book every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newIndex = (featuredBookIndex + 1) % books.length;
      setFeaturedBookIndex(newIndex);
    }, 5000);
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [featuredBookIndex]);

  return (
    <div className="featured-books-section">
      {/* Featured Book Display */}
      <div className="book-info">
        <h2>{books[featuredBookIndex].title}</h2>
        <p>{books[featuredBookIndex].summary}</p>
        <img className="small-book-image" src={books[featuredBookIndex].image} alt={books[featuredBookIndex].title} />
      </div>
    </div>
  );
};

export default FeaturedBooks;
