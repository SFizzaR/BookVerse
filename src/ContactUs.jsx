import React, { useState } from "react";
import Navbar from "./components/navbarHome";
import './contact-us.css';
import SocialIcons from "./components/SocailIcons";

const ContactUs = () => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [showRatingForm, setShowRatingForm] = useState(false);

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
    setShowRatingForm(true); // Show the comment box when a rating is selected
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);
    alert("Thank you for your message! We will get back to you shortly.");
    event.target.reset(); // Reset the form
  };

  return (
    <div className="contact-us">
      <Navbar />
      <header>
        <h1>Contact Us</h1>
      </header>
      <main>
        <section id="contact">
          <div className="container">
            <h2>Have Questions? We're Here to Help!</h2>
            <form onSubmit={handleFormSubmit}>
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" required />

              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required />

              <label htmlFor="message">Message:</label>
              <textarea id="message" name="message" required></textarea>

              <button type="submit">Submit</button>
            </form>
          </div>
        </section>
        <section id="rate-website">
          <div className="container">
            <h2>Give Us Your Star Power!</h2>
            <div id="stars" className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= selectedRating ? "selected" : ""}`}
                  data-value={star}
                  onClick={() => handleStarClick(star)}
                  onMouseOver={() => setSelectedRating(star)}
                  onMouseOut={() => setSelectedRating(0)}
                >
                  &#9733;
                </span>
              ))}
            </div>
            {showRatingForm && (
              <form id="rating-form">
                <label htmlFor="comments">Additional Comments:</label>
                <textarea
                  id="comments"
                  name="comments"
                  placeholder="Let us know how we can improve..."
                  rows="4"
                ></textarea>
                <button type="submit">Submit Rating</button>
              </form>
            )}
          </div>
        </section>
      </main>
      <SocialIcons />
    </div>
  );
};

export default ContactUs;
