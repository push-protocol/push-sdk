import React from 'react';
import { useSpaceData } from '../../context';

export interface SpaceBannerProps {
  // Add props specific to the SpaceBanner component
  temporary?: string; // just to remove eslint error of empty prop
}

const SpaceBanner: React.FC<SpaceBannerProps> = () => {
  const { spaceBannerData, setSpaceBannerData } = useSpaceData();

  // Use spaceBannerData and setSpaceBannerData in your component

  return <div>{/* Render your component content here */}</div>;
};

export default SpaceBanner;
