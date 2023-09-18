import React, { useContext, useState } from 'react';
import { useSpaceComponents } from './useSpaceComponents';
import { Checkbox } from '../components/Checkbox';
import { AccountContext } from '../context';

export const SpaceFeed = () => {
  const { SpaceFeedComponent } = useSpaceComponents();
  const [address, setAddress] = useState<string>();
  const [showTab, setShowTab] = useState<boolean>(true);
  const [horizontal, setHorizontal] = useState<boolean>(false);
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>(500);
  const [sortingOrder, setSortingOrder] = useState<string[]>([]);
  const { setSpaceId } = useContext<any>(AccountContext);

  const handleShowTab = () => {
    setShowTab(!showTab);
  };

  const handleHorizontal = () => {
    setHorizontal(!horizontal);
  };

  const handleAddressChange = (e: React.SyntheticEvent<HTMLElement>) => {
    setAddress((e.target as HTMLInputElement).value);
  };

  const handleWidthChange = (e: React.SyntheticEvent<HTMLElement>) => {
    setWidth((e.target as HTMLInputElement).value as unknown as number);
  };

  const handleHeightChange = (e: React.SyntheticEvent<HTMLElement>) => {
    setHeight((e.target as HTMLInputElement).value as unknown as number);
  };

  return (
    <>
      <Checkbox
        id=""
        label="Show Tabs"
        value={showTab}
        onChange={handleShowTab}
      />
      <Checkbox
        id=""
        label="Horizontal?"
        value={horizontal}
        onChange={handleHorizontal}
      />
      <label>Address</label>
      <br />
      <input
        type="text"
        onChange={handleAddressChange}
        value={address}
        style={{ width: 400, height: 30 }}
      />
      <br />
      <label>Width</label>
      <br />
      <input
        type="number"
        onChange={handleWidthChange}
        value={width as number}
        style={{ width: 400, height: 30 }}
      />
      <br />
      <label>Height</label>
      <br />
      <input
        type="number"
        onChange={handleHeightChange}
        value={height as number}
        style={{ width: 400, height: 30 }}
      />
      <SpaceFeedComponent
        showTabs={showTab}
        orientation={horizontal ? 'horizontal' : 'vertical'}
        width={width}
        height={height}
        onBannerClickHandler={(spaceId: string) => {
          console.log('spaceId: ', spaceId);
          setSpaceId(spaceId);
        }}
      />
    </>
  );
};
