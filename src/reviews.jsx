import React, { useState } from "react";
import Navbar from "../components/navbarUser";
import './review.css';
import SocialIcons from "../components/SocailIcons";

const ReviewForm = () => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = formData.get("name");
    const comments = formData.get("comments");

    console.log(`Name: ${name}, Rating: ${selectedRating}, Comments: ${comments}`);
    alert("Thank you for your review!");
    setReviewSubmitted(true); // Mark the review as submitted
    event.target.reset(); // Reset the form
  };

  return (
    <div className="review-form">
      <Navbar />
      <header className="my-header">
        <h1>Leave a Review</h1>
      </header>
      <main>
        <section id="review">
          <div className="review-container">
            {!reviewSubmitted ? (
              <>
                <h2>We Value Your Feedback!</h2>
                <form onSubmit={handleFormSubmit}>
                  <label htmlFor="name">Name:</label>
                  <input type="text" id="name" name="name" required />

                  <label htmlFor="rating">Rating:</label>
                  <div id="stars" className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${star <= selectedRating ? "selected" : ""}`}
                        onClick={() => handleStarClick(star)}
                      >
                        &#9733;
                      </span>
                    ))}
                  </div>
                  {selectedRating === 0 && <p className="error">Please select a rating.</p>}

                  <label htmlFor="comments">Comments:</label>
                  <textarea
                    id="comments"
                    name="comments"
                    placeholder="Let us know your thoughts..."
                    rows="4"
                    required
                  ></textarea>

                  <button id="submitReview" type="submit" disabled={selectedRating === 0}>
                    Submit Review
                  </button>
                </form>
              </>
            ) : (
              <div className="thank-you">
                <h2>Thank You for Your Feedback!</h2>
                <p>We appreciate your time and effort in helping us improve.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <SocialIcons />
    </div>
  );
};

export default ReviewForm;
