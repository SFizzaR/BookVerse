import React from "react";
import "./importance.css";
import SocialIcons from "./components/SocailIcons.jsx";
import Navbar from "./components/navbarHome";
import neil from './assets/neil.png';
import haruki from './assets/author2.png';

const Importance = () => {
  return (
    <div className="importance-page">
      <Navbar />
      <main>
        <div className="containerH2">
          <div className="reading-links">
            <h3>Want to improve your reading skills? Check out these resources:</h3>
            <p><a href="/tips">Tips and Tricks to Enhance Your Reading Habits</a></p>
            <p><a href="/exercises">Boost your reading skills with exercises</a></p>
          </div>
        </div>
        <section class="importance-of-reading container">
                <h2>The Universe Within the Pages: Why Reading is Your Gateway to Infinite Worlds</h2>
                <p>Imagine stepping into a vast, unexplored galaxy, where each book you open is a new star. With each turn of the page, you’re not just reading—you're embarking on an adventure that takes you to different worlds, challenges your perspectives, and opens doors to infinite possibilities. Reading, much like exploring the universe, is an ever-expanding journey—one where there are no limits, no boundaries, only endless discoveries.</p>
                <blockquote>"A reader lives a thousand lives before he dies. The man who never reads lives only one." — George R.R. Martin</blockquote>

            </section>
        
            <section class="first-step container">
                <h2>The First Step: Entering a New World</h2>
                <p>When you pick up a book, you're not simply absorbing words; you’re entering a whole new reality. Just like the iconic <em>The Chronicles of Narnia</em> by C.S. Lewis, where a wardrobe transforms into a doorway to another world, books give us the ability to transport ourselves into realms far beyond our own. The best part? You control where you go, what you see, and who you become.</p>
                <blockquote>“We read to know we are not alone.” — C.S. Lewis</blockquote>
            </section>
        
            <section class="power-of-perspective container">
                <h2>The Power of Perspective: Seeing Through Different Eyes</h2>
                <p>Every book offers a new lens to view the world. Through the writings of Jane Austen, we experience the elegance and intricacies of 19th-century British society. With <em>The Great Gatsby</em> by F. Scott Fitzgerald, we delve deep into the complexities of ambition, love, and the American Dream. Each book is a chance to understand someone else's life, experience, and viewpoint, often challenging and changing our own perspective.</p>
                <blockquote>“A good book is an event in my life.” — Stendhal</blockquote>
            </section>
        
            <section class="bridge-across-time container">
                <h2>A Bridge Across Time: Traveling Through History</h2>
                <p>Books are more than stories—they’re windows to history, carrying the lessons, wisdom, and emotions of past generations. Think of <em>1984</em> by George Orwell, which reflects the power of surveillance and the threat of totalitarianism. It’s not just fiction; it’s a reflection of human fears and a warning for the future. Through literature, we can experience the world’s most significant events—from the ancient worlds of Homer’s <em>Odyssey</em> to the modern conflicts of <em>The Kite Runner</em> by Khaled Hosseini.</p>
                <blockquote>“Books are a uniquely portable magic.” — Stephen King</blockquote>
            </section>
        
            <section class="adventure-of-knowledge container">
                <h2>The Adventure of Knowledge: Discovering New Frontiers</h2>
                <p>Reading isn’t just about stories. It’s about learning, growing, and evolving. With every non-fiction book, whether it’s about technology, philosophy, or science, we unlock new knowledge that helps us understand our world. Imagine diving into the intricate worlds of astrophysics with Stephen Hawking’s <em>A Brief History of Time</em>, or understanding the human psyche with Viktor Frankl’s <em>Man's Search for Meaning</em>. These books expand our minds, pushing us to think bigger and ask deeper questions.</p>
                <blockquote>“Books can be dangerous. The best ones should be labeled ‘This could change your life.’” — Helen Exley</blockquote>

            </section>
        
            <section class="interactive-journey container">
                <h2>Interactive Journey: Your Personal Story Within the Pages</h2>
                <p>Reading is a two-way journey. As you connect with the characters and themes, you bring your own life experiences into the fold. This interaction creates a personal connection, making each book uniquely yours. The emotions you feel, the thoughts you ponder, and the lessons you learn all combine to shape your journey with every book.</p>
                <blockquote>“We are all different books with different covers.” — Unknown</blockquote>
            </section>
        
            <section class="never-ending-journey container">
                <h2>The Never-Ending Journey: Books That Stay with You</h2>
                <p>Books have the power to linger long after the last page is turned. A story or lesson that stays with you—whether it’s the courage of Katniss Everdeen in <em>The Hunger Games</em> or the moral reflections in <em>To Kill a Mockingbird</em>—becomes a part of you. These books become companions on your personal journey, offering advice, comfort, or inspiration whenever needed.</p>
                <blockquote>“The more that you read, the more things you will know. The more that you learn, the more places you'll go.” — Dr. Seuss</blockquote>

            </section>

            <section class="exploring-genres container">
                <h2>Exploring New Genres: Unlocking Hidden Treasures</h2>
                <p>Delving into genres you’ve never considered before can reveal unexpected joys. From mystery thrillers to science fiction, exploring new genres allows you to uncover stories you may never have thought to read.</p>
                <blockquote>“Books are a mirror. If a fool looks in, you cannot expect a genius to look out.” — J.K. Rowling</blockquote>

            </section>
        
            <section class="books-for-all-ages container">
                <h2>Books for All Ages: A Journey for Everyone</h2>
                <p>Reading isn’t just for adults—it’s an adventure for all ages. Whether it’s children’s books, young adult fiction, or memoirs for seniors, there’s a world of stories suited to everyone’s tastes and experiences.</p>
                <blockquote>“The world was hers for the reading.” — Betty Smith</blockquote>

            </section>
        
            <section class="books-and-healing container">
                <h2>The Healing Power of Books: Emotional and Mental Well-being</h2>
                <p>Books have an incredible ability to heal. They offer solace during difficult times, helping us navigate grief, anxiety, or stress. Fictional tales and self-help books alike can serve as a form of therapy, allowing us to connect with characters or insights that offer guidance and comfort.</p>
                <blockquote>“Books are a refuge, a therapy for the soul.” — Unknown</blockquote>

            </section>
        
            <section class="reading-for-creativity container">
                <h2>Reading for Creativity: Fueling Your Imagination</h2>
                <p>Books not only inspire new ideas but also boost creativity. The power of storytelling encourages you to think outside the box, helping you generate innovative concepts that can be applied to your own work or hobbies.</p>
                <blockquote>“Imagination is more important than knowledge.” — Albert Einstein</blockquote>

            </section>
        <div className="author-section">
          <div className="author-image">
            <img src={neil} alt="Neil Gaiman" />
          </div>
          <div className="author-quote">
            <blockquote>
              “A book is a dream that you hold in your hands, an invitation to step beyond the boundaries of time...”
            </blockquote>
            <cite>Neil Gaiman</cite>
          </div>
        </div>
        <div className="author-section-2">
          <div className="author-quote-2">
            <blockquote>
              “Reading is a portal to the infinite possibilities of the mind...”
            </blockquote>
            <cite>— Haruki Murakami</cite>
          </div>
          <div className="author-image-2">
            <img src={haruki} alt="Haruki Murakami" />
          </div>
        </div>
      </main>
      <SocialIcons />
    </div>
  );
};

export default Importance;
