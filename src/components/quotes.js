import Sparkle from 'react-sparkle';
import React from 'react';
import './quotes.css';

function Quote() {
    return (
        <div className="quote">
            <div className="sparkle-container">
                <Sparkle color="white" count={20} fadeOut={true} />
            </div>
            <blockquote>
                "I am not afraid of storms, for I am learning how to sail my ship."
            </blockquote>
            <div className="button">
                <button className="moreQuotes">More Quotes</button>
            </div>
        </div>
    );
}

// Export the Quote component
export default Quote;
