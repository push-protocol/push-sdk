import React from 'react';

export interface SpaceWidgetProps {
  // Add props specific to the SpaceWidget component
  temporary?: string; // just to remove eslint error of empty prop
}

const SpaceWidget: React.FC<SpaceWidgetProps> = (props) => {
  // Implement the SpaceWidget component
  return <div>SpaceWidget Component</div>;
}

export default SpaceWidget;
