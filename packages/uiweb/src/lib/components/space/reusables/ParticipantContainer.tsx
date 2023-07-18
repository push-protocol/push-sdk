import React from 'react';
import styled from 'styled-components';

export interface IParticipantContainerProps {
  participants: any[];
  orientation?: 'maximized' | 'minimized' | 'pill';
  imageHeight?: any;
}

export const ParticipantContainer: React.FC<IParticipantContainerProps> = ({
  participants,
  orientation,
  imageHeight,
}) => {
  return (
    <Participants>
      <ParticipantsIconContainer orientation={orientation}>
        {orientation === 'pill'
          ? participants &&
            participants.map(
              (person, index) =>
                index < 2 && (
                  <ParticipantsIcon
                    src={(person as any)?.image}
                    alt="avatar"
                    className={`index${index}`}
                  />
                )
            )
          : participants &&
            participants.map(
              (person, index) =>
                index < 3 && (
                  <ParticipantsIcon
                    src={(person as any)?.image}
                    alt="avatar"
                    className={`index${index}`}
                  />
                )
            )}
      </ParticipantsIconContainer>
      <ParticipantsText>
        {orientation === 'pill'
          ? participants && (participants.length as number) - 3 > 0
            ? `+${(participants.length as number) - 3}`
            : null
          : participants && (participants.length as number) - 3 > 0
          ? `+${(participants.length as number) - 3}`
          : null}
      </ParticipantsText>
    </Participants>
  );
};

const Participants = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}`;

const ParticipantsIconContainer = styled.div<{ orientation?: string }>`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  width: ${(props) => (props.orientation === 'pill' ? '46.5px' : '62px')};
  padding: 0 4px;
}`;

const ParticipantsIcon = styled.img<{ imageHeight?: any }>` 
  height: ${(props) => (props.imageHeight ? props.imageHeight : '31px')};
  border-radius: 50%;

  &.index0 {
    position: relative;
    top: 0;
    left: 0;
    // z-index: 3;
  }
  &.index1 {
    position: relative;
    top: 0;
    left: -50%;
    // z-index: 2;
  }
  &.index2 {
    position: relative;
    top: 0;
    left: -100%;
    // z-index: 1;
  }
}`;

const ParticipantsText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
}`;
