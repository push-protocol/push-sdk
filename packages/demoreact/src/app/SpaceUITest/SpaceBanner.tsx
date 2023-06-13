import React, { useState } from 'react';
import { useSpaceComponents } from './useSpaceComponents';
import { Section, SectionItem } from '../components/StyledComponents';
import { Checkbox } from '../components/Checkbox';

export const SpaceBanner = () => {
  const { SpaceBannerComponent } = useSpaceComponents();
  const [spaceId, setSpaceId] = useState<string>('');
  const [isMaximized, setIsMaximized] = useState<boolean>(true);
  const updateSpaceId = (e: React.SyntheticEvent<HTMLElement>) => {
    setSpaceId((e.target as HTMLInputElement).value);
  };

  const updateIsMaximized = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <div>
      <Section>
        <SectionItem>
          <label>spaceId</label>
          <input
            type="text"
            onChange={updateSpaceId}
            value={spaceId}
            style={{ width: 400, height: 30 }}
          />
        </SectionItem>
        <Checkbox
          id="isMaximized"
          label="Maximized"
          value={isMaximized}
          onChange={updateIsMaximized}
        />
      </Section>
      <SpaceBannerComponent
        spaceId={spaceId}
        orientation={isMaximized ? 'maximized' : 'minimized'}
      />
    </div>
  );
};
