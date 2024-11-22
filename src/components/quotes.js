import React from 'react';
import './quotes.css';
import { useNavigate } from 'react-router-dom';

function Quote() {
    const navigate = useNavigate(); // Hook to navigate programmatically

   const handleQuotes = () =>{
        navigate ('/quotes');
    }
 
    return (
        <div className="quote">
        
            <blockquote>
                "I am not afraid of storms, for I am learning how to sail my ship."
            </blockquote>
            <div className="button">
                <button className="moreQuotes" onClick={handleQuotes}>More Quotes</button>
            </div>
        </div>
    );
}

// Export the Quote component
export default Quote;
