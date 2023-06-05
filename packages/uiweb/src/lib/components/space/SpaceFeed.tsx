import React from 'react';

export interface SpaceFeedProps {
  // Add props specific to the SpaceWidget component
  temporary?: string; // just to remove eslint error of empty prop
}

const SpaceFeed: React.FC<SpaceFeedProps> = (props) => {
  // Implement the SpaceFeed component
  return <div>SpaceFeed Component</div>;
}

export default SpaceFeed;
