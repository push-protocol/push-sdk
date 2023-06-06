import React from 'react';

export interface ISpaceWidgetProps {
  // Add props specific to the SpaceWidget component
  temporary?: string; // just to remove eslint error of empty prop
}

export const SpaceWidget: React.FC<ISpaceWidgetProps> = (props) => {
  // Implement the SpaceWidget component
  return <div>SpaceWidget Component</div>;
}
