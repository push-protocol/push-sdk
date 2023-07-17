import React from 'react';
import styled from 'styled-components';

export const SpaceBannerLoadingSkeleton: React.FC = () => {
  return (
    <SkeletonContainer>
    <SkeletonContent>
      <SkeletonProfilePic />
      <SkeletonProfileInfo>
        <SkeletonName />
        <SkeletonHandle />
      </SkeletonProfileInfo>
    </SkeletonContent>
    <SkeletonSpaceInfo />
    <SkeletonLine>
      <SkeletonLeftSquare />
      <SkeletonOverlap>
        <SkeletonOverlapProfilePic />
        <SkeletonOverlapProfilePic />
        <SkeletonOverlapProfilePic />
      </SkeletonOverlap>
    </SkeletonLine>
  </SkeletonContainer>
  );
};

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px;
  background-color: #f1f1f1;
  border-radius: 17px;
  border: 1px solid lightgrey;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 17px;
    background-color: #f1f1f1;
    opacity: 0.5;
    transition: opacity 0.8s ease-in-out infinite alternate;
  }

  &:hover:after {
    opacity: 0.3;
  }
`;

const SkeletonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SkeletonProfilePic = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid lightgrey;
  background-color: #d9d9d9;
  transition: opacity 0.8s ease-in-out infinite alternate;

  &:hover {
    opacity: 0.5;
  }
`;

const SkeletonProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
`;

const SkeletonText = styled.div`
  width: 100%;
  height: 18px;
  background-color: #d9d9d9;
  border-radius: 8px;
  border: 1px solid lightgrey;
  transition: opacity 0.8s ease-in-out infinite alternate;

  &:hover {
    opacity: 0.5;
  }
`;

const SkeletonName = styled(SkeletonText)`
  width: 30%;
`;

const SkeletonHandle = styled(SkeletonText)`
  width: 40%;
`;

const SkeletonSpaceInfo = styled(SkeletonText)`
  width: 100%;
  height: 30px;
`;

const SkeletonLine = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const SkeletonLeftSquare = styled(SkeletonText)`
  width: 10%;
  height: 32px;
`;

const SkeletonOverlap = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: right;
  width: 100%;
  margin-top: 8px;
`;

const SkeletonOverlapProfilePic = styled(SkeletonProfilePic)`
  height: 48px;
  border: 1px solid lightgrey;
  margin-left: -24px;
  transition: opacity 0.8s ease-in-out infinite alternate;
  &:nth-child(2) {
    margin-left: -24px;
  }
  &:nth-child(3) {
    margin-left: -24px;
  }
`;
