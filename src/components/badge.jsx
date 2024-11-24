import React from "react";

const Badge = ({ imgSrc, title, description }) => (
  <div className="badge">
    <img src={imgSrc} alt={`${title}`} className="badge-img" />
    <h4>{title}</h4>
    <p>{description}</p>
  </div>
);

export default Badge;
