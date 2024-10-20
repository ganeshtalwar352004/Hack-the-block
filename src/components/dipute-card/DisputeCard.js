import React from 'react';
import './dipute-card.css'; // Import the CSS file

const DisputeCard = ({ user1, user2, disputeText }) => {
  return (
    <div className="dispute-card ">
      <div className="dispute-header">
        <h2>Dispute</h2>
      </div>
      <div className="dispute-content">
        <div className="user">
          <h3>{user1}</h3>
          <p className="dispute-text">{disputeText}</p>
        </div>
        <div className="vs">VS</div>
        <div className="user">
          <h3>{user2}</h3>
          <p className="dispute-text">{disputeText}</p>
        </div>
      </div>
      <div className="vote-button">
        <button>Vote</button>
      </div>
    </div>
  );
};

export default DisputeCard;
