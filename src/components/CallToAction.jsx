import React from 'react';
import './CallToAction.css'; // Include a CSS file for styles
import { FaBookOpen, FaRocket, FaBrain } from 'react-icons/fa';
import image from '../assets/reading.jpg';
import { useNavigate } from 'react-router-dom';
const CallToAction = () => {
    const navigate = useNavigate(); // React Router hook for navigation

    const handleExplore = () =>{
navigate('/importance');
    }
    return (
        <section className="cta-section">
            <div className="cta-content">
                <h2>Unlock Your Reading Potential</h2>
                <p>
                    Are you ready to transform your reading experience?
                </p>
                <p>
                    Reading is not just a passive activity; it's a powerful tool that can open doors to new worlds, expand your knowledge, and boost your creativity.
                </p>
                <div className="cta-icons">
                    <div>
                        <FaBookOpen className="cta-icon" />
                        <p>Expand Knowledge</p>
                    </div>
                    <div>
                        <FaRocket className="cta-icon" />
                        <p>Boost Creativity</p>
                    </div>
                    <div>
                        <FaBrain className="cta-icon" />
                        <p>Improve Comprehension</p>
                    </div>
                </div>
                <button className="cta-button" onClick={handleExplore}>Click to Explore More</button>
            </div>
            <div className="cta-image">
                <img
                    src= {image}
                    alt="Reading Inspiration"
                />
            </div>
        </section>
    );
};

export default CallToAction;
