import React from 'react';
import './aboutUs.css';
import falah from './assets/falah.jpeg';
import zahab from './assets/zahab.jpeg';
import fizza from './assets/fizza.jpeg';
import SocialIcons from './components/SocailIcons.js';
import Navbar from './components/navbarHome.js';

const AboutUs = () => {
  return (
    <div className='about-page'>
      <Navbar />
      <header>
        <h1>About Us</h1>
        <h2>Zahab Jahangir | Falah Zainab | Syeda Fizza</h2>
      </header>
      <section id="about">
      <div class="container">
            <h3>BOOK VERSE</h3>
            <p>Welcome to Bookverse, where authors and readers unite to discover, share, and immerse themselves in an endless world of captivating book collections.</p>
            
            <h3>History of Creators</h3>
            <p>Our journey began in 2023, when three passionate book lovers came together with a shared dream: to create a space where readers and authors could connect in a meaningful way. The idea for Bookverse sparked from countless conversations about how books have the power to change lives, spark imagination, and foster connections. As avid readers ourselves, we recognized the need for a platform that not only offered a wide variety of books but also allowed authors to engage directly with their audience.</p>
           <p>What started as a simple idea quickly grew into something much larger. We spent months developing the platform, curating collections, and testing features to ensure that Bookverse would be an intuitive and welcoming space for all book enthusiasts. By the end of 2023, we launched Bookverse to the public, and the response was overwhelming. Readers from all walks of life joined the platform, while authors saw the opportunity to share their stories and ideas with a wider audience.</p>
           <p>Today, Bookverse has become a thriving community where books are celebrated, stories are shared, and new connections are made every day. We aspire that it becomes the number one website for readers and authors worldwide and continues to grow, providing a space where every voice is heard and every story matters. We’re incredibly proud of the journey we’ve been on and are excited to see how Bookverse continues to evolve, bringing even more authors and readers together for years to come.</p>
           <h3>Our Mission </h3>
           <p>At Bookverse, our mission is to create a platform where authors and readers can connect, share, and explore the transformative power of books. We believe in the magic of storytelling and aim to build a community where every voice is heard, and every story finds its audience. Our goal is not only to provide a space for book lovers to discover new works but also to foster a deeper appreciation for literature by offering authors the opportunity to reach and engage with their readers directly.</p>
           </div>
      </section>

     
      <section id="creators">
  <div className="container">
    <h2>Meet the Creators</h2>
    <div className="creator">
      <div className="creator-image">
        <img src={zahab} alt="Zahab Jahangir" />
      </div>
      <div className="text-content">
        <h3>Zahab Jahangir</h3>
        <p>
          "Books have always been my escape, and through Bookverse, I hope
          to connect with fellow book lovers and share the joy of reading
          with the world. This platform is not just a project; it's my
          passion brought to life, and I am excited to be part of a
          community where every book tells its own story."
        </p>
      </div>
    </div>
    <div className="creator">
      <div className="creator-image">
        <img src={falah} alt="Falah" />
      </div>
      <div className="text-content">
        <h3>Falah Zainab</h3>
        <p>
          "I believe in the power of storytelling to change the world.
          Bookverse is our way of creating a space where every voice is
          heard and every story matters. It's a place where imagination
          can run free, and where readers and writers alike can discover
          the magic in every page."
        </p>
      </div>
    </div>
    <div className="creator">
      <div className="creator-image">
        <img src={fizza} alt="Fizza" />
      </div>
      <div className="text-content">
        <h3>Syeda Fizza</h3>
        <p>
          "Creating Bookverse has been a dream come true. As a lifelong
          reader, I understand the importance of having a platform that
          celebrates books and the people behind them. I am excited to
          bring together authors and readers in a space that cherishes the
          magic of books and the power of connection."
        </p>
      </div>
    </div>
  </div>
</section>
      <SocialIcons />
    </div>
  );
};

export default AboutUs;
