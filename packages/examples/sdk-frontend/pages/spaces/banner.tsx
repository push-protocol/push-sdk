import React, { useState } from 'react';

import { useSpaceComponents } from './../../components/Spaces/useSpaceComponent';
import {
  Section,
  SectionItem,
} from './../../components/Spaces/StyledComponents';
import Dropdown from './../../components/Spaces/Dropdown';
import { NextPage } from 'next';
import Spaces from '.';

const SpaceBanner: NextPage = () => {
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
      <Spaces />
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

export default SpaceBanner;
