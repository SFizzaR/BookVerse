import React from "react";

const readerBadge = ({ imgSrc, name, reads, badge }) => (
  <div className="reader">
    <img src={imgSrc} alt={`${name} Badge`} className="badge-img" />
    <h3>{name}</h3>
    <h6>Total reads: {reads}</h6>
    <h6>Badge: {badge}</h6>
  </div>
);

export default readerBadge;
