import React from 'react';
import './popularPost.css';
import tipsImage from './tips.jpg';
import interviewImage from './interview.jpg';
import rightBookImage from './right_book.jpg';

// Array of popular posts data
const popularPosts = [
  { title: "Top 10 Reading Tips", summary: "Discover the best ways to immerse yourself in books.", image: tipsImage  },
  { title: "Interview with Author Jane Doe", summary: "An in-depth conversation with the award-winning author.", image: interviewImage },
  { title: "How to Choose the Right Book", summary: "A guide to finding the perfect book for your taste.", image: rightBookImage },
];

// PopularPosts Component
const PopularPosts = () => {
  return (
    <div class="Featured-posts">
        <h3>Featured posts</h3>
    <div id="postsCards" className="posts-container">
      {popularPosts.map((post, index) => (
        <div className="post-card" key={index}>
          <img src={post.image} alt={post.title} />
          <h4>{post.title}</h4>
          <p>{post.summary}</p>
          <a href="#">Read More</a>
        </div>
      ))}
    </div>
    </div>
  );
}

export default PopularPosts;
