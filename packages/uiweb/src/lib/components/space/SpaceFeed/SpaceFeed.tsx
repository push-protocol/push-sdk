import React from 'react';

export interface ISpaceFeedProps {
  // Add props specific to the SpaceWidget component
  temporary?: string; // just to remove eslint error of empty prop
}

export const SpaceFeed: React.FC<ISpaceFeedProps> = (props) => {
  // Implement the SpaceFeed component
  return <div>SpaceFeed Component</div>;
}
