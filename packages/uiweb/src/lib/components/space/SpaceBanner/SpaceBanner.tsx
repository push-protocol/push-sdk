import React from 'react';
import { useSpaceData } from '../../../hooks';

export interface ISpaceBannerProps {
  // Add props specific to the SpaceBanner component
  temporary?: string; // just to remove eslint error of empty prop
}

export const SpaceBanner: React.FC<ISpaceBannerProps> = () => {
  const { spaceBannerData, setSpaceBannerData } = useSpaceData();

  // Use spaceBannerData and setSpaceBannerData in your component

  return <div>{/* Render your component content here */}</div>;
};
