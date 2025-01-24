import React, { useEffect, useState } from 'react';
import './QuotesPage.css';
import tokillamockingbird from './assets/tokillamockingbird.png';
import georgeOrwell from './assets/georgeorwell.png';
import pnp from './assets/pnp.png';
import scott from './assets/scott.png';
import mobyDick from './assets/callme.png';
import catcher from './assets/catcher.png';
import bravenewworld from './assets/bravenewworld.png';
import raybradbury from './assets/raybradbury.png';
import albus from './assets/albus.png';
import alchemist from './assets/alchemist.png';
import divine from './assets/divine.png';
import emily from './assets/emily.png';
import family from './assets/family.png';
import farad from './assets/farad.png';
import grapes from './assets/grapes.png';
import hobit from './assets/hobbit.png';
import odsey from './assets/odsey.png';
import oscarwild from './assets/oscarwilde.png';
import road from './assets/road.png';
import soli from './assets/soli.png';
import Navbar from './components/navbarHome';
import SocialIcons from './components/SocailIcons';
const QuotePage = () => {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    const fetchedQuotes = [
      {
        book: "To Kill a Mockingbird",
        author: "Harper Lee",
        quote: "You never really understand a person until you consider things from his point of view... Until you climb inside of his skin and walk around in it.",
        image: tokillamockingbird,
      },
      {
        book: "1984",
        author: "George Orwell",
        quote: "War is peace. Freedom is slavery. Ignorance is strength.",
        image: georgeOrwell,
      },
      {
        book: "Pride and Prejudice",
        author: "Jane Austen",
        quote: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
        image: pnp,
      },
      {
        book: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        quote: "So we beat on, boats against the current, borne back ceaselessly into the past.",
        image: scott,
      },
      {
        book: "Moby Dick",
        author: "Herman Melville",
        quote: "Call me Ishmael.",
        image: mobyDick,
      },
      {
        book: "The Catcher in the Rye",
        author: "J.D. Salinger",
        quote: "People always think something’s all true.",
        image: catcher,
    },
    {
        book: "Brave New World",
        author: "Aldous Huxley",
        quote: "Community, Identity, Stability.",
        image: bravenewworld
    },
    {
        book: "Fahrenheit 451",
        author: "Ray Bradbury",
        quote: "It was a pleasure to burn.",
        image: raybradbury
    },
    {
        book: "The Hobbit",
        author: "J.R.R. Tolkien",
        quote: "In a hole in the ground there lived a hobbit.",
        image: hobit
    },
    {
        book: "Harry Potter and the Sorcerer's Stone",
        author: "J.K. Rowling",
        quote: "It takes a great deal of bravery to stand up to our enemies, but just as much to stand up to our friends.",
        image: albus
    },
    {
        book: "The Alchemist",
        author: "Paulo Coelho",
        quote: "When you want something, all the universe conspires in helping you to achieve it.",
        image: alchemist
    },
    {
        book: "The Picture of Dorian Gray",
        author: "Oscar Wilde",
        quote: "The only way to get rid of a temptation is to yield to it.",
        image: oscarwild
    },
    {
        book: "The Odyssey",
        author: "Homer",
        quote: "I am not afraid of storms, for I am learning how to sail my ship.",
        image: odsey
    },
    {
        book: "The Divine Comedy",
        author: "Dante Alighieri",
        quote: "Abandon all hope, ye who enter here.",
        image: divine
    },
    {
        book: "The Brothers Karamazov",
        author: "Fyodor Dostoevsky",
        quote: "If God does not exist, everything is permitted.",
        image: farad
    },
    {
        book: "Anna Karenina",
        author: "Leo Tolstoy",
        quote: "All happy families are alike; each unhappy family is unhappy in its own way.",
        image: family
    },
    {
        book: "Wuthering Heights",
        author: "Emily Brontë",
        quote: "I cannot live without my soul.",
        image: emily
    },
    {
        book: "The Road",
        author: "Cormac McCarthy",
        quote: "You forget what you want to remember, and you remember what you want to forget.",
        image: road
    },
    {
        book: "One Hundred Years of Solitude",
        author: "Gabriel García Márquez",
        quote: "It's enough for me to be sure that you and I exist at this moment.",
        image: soli
    },
    {
        book: "The Grapes of Wrath",
        author: "John Steinbeck",
        quote: "And the people listened to the words of the preacher, and they felt that they were the last words they would ever hear.",
        image: grapes
    }
    ];

    setQuotes(fetchedQuotes);
  }, []);

  return (
    <div className="quote-page">
      <Navbar />
      <header>
        <h1>The Essence of Literature</h1>
      </header>
      <section id="home">
        <div className="container-h2">
          <h2>Iconic Quotes from the Best Literary Works</h2>
        </div>
      </section>
      <section id="quotes">
        <div className="container" id="quotes-container">
          {quotes.map((quote, index) => (
            <div key={index} className="quote-card">
              <img
                src={quote.image || '/assets/placeholder.png'}
                alt={`Image for ${quote.book}`}
                className="quote-image"
              />
              <div className='text-container'>
              <h3>{quote.book}</h3>
              <p className="quote-text">"{quote.quote}"</p>
              <p className="quote-author">— {quote.author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <SocialIcons />
    </div>
  );
};

export default QuotePage;
