import React from 'react';
import styled from 'styled-components';

export interface ISpaceFeedProps {
  // Add props specific to the SpaceWidget component
  temporary?: string; // just to remove eslint error of empty prop
}

export const SpaceFeed: React.FC<ISpaceFeedProps> = (props) => {
  // Implement the SpaceFeed component
  return (
    <Container>
      <Spaces></Spaces>
      <PopularSpaces>
        Popular Spaces
      </PopularSpaces>
    </Container>
  );
};

//Styling
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: left;
  background: #ffffff;
  border: 1px solid #dcdcdf;
  border-radius: 12px;
  width: inherit;
  height: auto;
  padding: 24px 32px;
}`;

const Spaces = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  width: inherit;
  height: auto;
}`;

const PopularSpaces = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: left;
  background: #ffffff;
  width: inherit;
  height: auto;
  font-weight: 450;
  font-size: 18px;
  line-height: 23px;
}`;
