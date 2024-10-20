import React from 'react';
import DisputeCard from '../src/components/dipute-card/DisputeCard';
import WalletConnect from './components/Wallet-Connect/WalletConnect';
import './App.css'; // Ensure your styles are imported

const App = () => {
  const disputes = [
    {
      user1: 'Alice',
      user2: 'Bob',
      disputeText: 'Alice claims the design was plagiarized, but Bob insists it was original.',
    },
    {
      user1: 'John',
      user2: 'Sarah',
      disputeText: 'John says the codebase was properly documented, while Sarah argues it was incomplete.',
    },
    {
      user1: 'Michael',
      user2: 'Emma',
      disputeText: 'Michael argues his solution was more efficient, but Emma states her approach is easier to maintain.',
    },
  ];

  return (
    <>
      <div style={{ position: 'relative' }}> {/* Ensure this div is relative for absolute positioning of button */}
        <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Dispute Voting with Wallet</h1>
        <WalletConnect />
      </div>
      <div>
        {/* <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Dispute Voting</h1> */}
        {disputes.map((dispute, index) => (
          <DisputeCard
            key={index}
            user1={dispute.user1}
            user2={dispute.user2}
            disputeText={dispute.disputeText}
          />
        ))}
      </div>
    </>
  );
};

export default App;
