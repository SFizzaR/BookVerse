import React from "react";
import Navbar from "./components/navbarUser";
import SocialIcons from "./components/SocailIcons";
import Badge from './components/badge';
import Reader from  './components/reader-badge';
import beg from './assets/beg.png';
import intermediate from './assets/intermediate.png';
import gold from './assets/gold.png';
import expert from './assets/expert.png';
import master from './assets/master.png';
import './badge.css';
const bagePage = () => {
  const badges = [
    {
      id: "beginner",
      imgSrc: beg,
      title: "Beginnear Badge",
      description: "Awarded for reading at least 5 books.",
    },
    {
      id: "intermediate",
      imgSrc: intermediate,
      title: "Intermediate Badge",
      description: "Awarded for reading 15 or more books.",
    },
    {
      id: "gold",
      imgSrc: gold,
      title: "Gold Badge",
      description: "Awarded for reading 30 or more books.",
    },
    {
      id: "expert",
      imgSrc: expert,
      title: "Expert Badge",
      description: "Awarded for reading 50 or more books.",
    },
    {
      id: "master",
      imgSrc: master,
      title: "Master Badge",
      description: "Awarded for reading 100 or more books.",
    },
  ];

  const readers = [
    {
      id: "enub",
      imgSrc: beg,
      name: "Enub",
      reads: 4,
      badge: "Beginner",
    },
    {
      id: "zahab",
      imgSrc: intermediate,
      name: "Zahab",
      reads: 16,
      badge: "Intermediate",
    },
    {
      id: "falah",
      imgSrc: gold,
      name: "Falah",
      reads: 35,
      badge: "Gold",
    },
    {
      id: "fizza",
      imgSrc: expert,
      name: "Fizza",
      reads: 65,
      badge: "Expert",
    },
    {
      id: "zehra",
      imgSrc: master,
      name: "Zehra",
      reads: 104,
      badge: "Master",
    },
  ];

  return (
    <div className="bagePage">
      <Navbar />
      <main>
        <div className="badge-container">
          <h2>OUR READING EXCELLENCE BADGES</h2>
          <div className="badges">
            {badges.map((badge) => (
              <Badge key={badge.id} {...badge} />
            ))}
          </div>
        </div>
        <div className="container1">
          <h2>OUR TOP READERS</h2>
          <div className="readers">
            {readers.map((reader) => (
              <Reader key={reader.id} {...reader} />
            ))}
          </div>
        </div>
      </main>
      <SocialIcons />
    </div>
  );
};

export default bagePage;
