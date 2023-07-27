import React, { useState } from 'react';

import { useSpaceComponents } from './useSpaceComponents';
import { Section, SectionItem } from '../components/StyledComponents';
import Dropdown from '../components/Dropdown';

export const SpaceBanner = () => {
  const { SpaceBannerComponent } = useSpaceComponents();

  const [spaceId, setSpaceId] = useState<string>('');
  const [orientation, setOrientation] = useState('maximized');

  const updateSpaceId = (e: React.SyntheticEvent<HTMLElement>) => {
    setSpaceId((e.target as HTMLInputElement).value);
  };

  const updateOrientation = (e: any) => {
    setOrientation(e.target.value);
  };

  const onClickHandler = (arg: string) => {
    console.log(arg);
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
        <Dropdown
          label="orientation"
          options={[
            { label: 'maximized', value: 'maximized' },
            { label: 'minimized', value: 'minimized' },
            { label: 'pill', value: 'pill' },
          ]}
          value={orientation}
          onChange={updateOrientation}
        />
      </Section>
      <SpaceBannerComponent
        spaceId={spaceId}
        onBannerClick={onClickHandler}
        orientation={
          orientation === 'maximized'
            ? 'maximized'
            : orientation === 'minimized'
            ? 'minimized'
            : orientation === 'pill'
            ? 'pill'
            : undefined
        }
      />
    </div>
  );
};
