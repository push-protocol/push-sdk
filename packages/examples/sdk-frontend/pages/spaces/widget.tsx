import { useState } from 'react';
import {
  Section,
  SectionItem,
} from './../../components/Spaces/StyledComponents';
import { useSpaceComponents } from './../../components/Spaces/useSpaceComponent';
import Spaces from '.';
import { NextPage } from 'next';

const SpaceWidget: NextPage = () => {
  const { SpaceWidgetComponent } = useSpaceComponents();
  const [spaceId, setSpaceId] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [zIndex, setZIndex] = useState<string>('1000');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isHost, setisHost] = useState<boolean>(false);
  const [isLive, setisLive] = useState<boolean>(false);
  const [isMember, setisMember] = useState<boolean>(false);
  const [isJoined, setisJoined] = useState<boolean>(false);
  const [isTimeToStartSpace, setisTimeToStartSpace] = useState<boolean>(false);

  const updateSpaceId = (e: React.SyntheticEvent<HTMLElement>) => {
    setSpaceId((e.target as HTMLInputElement).value);
  };

  const updateWidgetWidth = (e: React.SyntheticEvent<HTMLElement>) => {
    setWidth((e.target as HTMLInputElement).value);
  };

  const updateZIndex = (e: React.SyntheticEvent<HTMLElement>) => {
    setZIndex((e.target as HTMLInputElement).value);
  };

  const updateShareUrl = (e: React.SyntheticEvent<HTMLElement>) => {
    setShareUrl((e.target as HTMLInputElement).value);
  };

  const updateIsHost = (e: React.SyntheticEvent<HTMLElement>) => {
    setisHost((e.target as HTMLInputElement).checked);
  };

  const updateIsLive = (e: React.SyntheticEvent<HTMLElement>) => {
    setisLive((e.target as HTMLInputElement).checked);
  };

  const updateIsMember = (e: React.SyntheticEvent<HTMLElement>) => {
    setisMember((e.target as HTMLInputElement).checked);
  };

  const updateIsJoined = (e: React.SyntheticEvent<HTMLElement>) => {
    setisJoined((e.target as HTMLInputElement).checked);
  };

  const updateIsTimeToStartSpace = (e: React.SyntheticEvent<HTMLElement>) => {
    setisTimeToStartSpace((e.target as HTMLInputElement).checked);
  };

  return (
    <div>
      <Spaces />
      <h2>Space Widget Test page</h2>
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
        <SectionItem>
          <label>Width</label>
          <input
            type="text"
            onChange={updateWidgetWidth}
            value={width}
            style={{ width: 400, height: 30 }}
          />
        </SectionItem>
        <SectionItem>
          <label>zIndex</label>
          <input
            type="text"
            onChange={updateZIndex}
            value={zIndex}
            style={{ width: 400, height: 30 }}
          />
        </SectionItem>
        <SectionItem>
          <label>Space Shareable Url</label>
          <input
            type="text"
            onChange={updateShareUrl}
            value={shareUrl}
            style={{ width: 400, height: 30 }}
          />
        </SectionItem>
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          Temp Props
        </div>
        <SectionItem>
          <input
            type="checkbox"
            onChange={updateIsHost}
            checked={isHost}
            style={{ width: 20, height: 20 }}
          />
          <label>isHost</label>
        </SectionItem>
        <SectionItem>
          <input
            type="checkbox"
            onChange={updateIsLive}
            checked={isLive}
            style={{ width: 20, height: 20 }}
          />
          <label>isLive</label>
        </SectionItem>
        <SectionItem>
          <input
            type="checkbox"
            onChange={updateIsMember}
            checked={isMember}
            style={{ width: 20, height: 20 }}
          />
          <label>isMember</label>
        </SectionItem>
        <SectionItem>
          <input
            type="checkbox"
            onChange={updateIsJoined}
            checked={isJoined}
            style={{ width: 20, height: 20 }}
          />
          <label>isJoined</label>
        </SectionItem>
        <SectionItem>
          <input
            type="checkbox"
            onChange={updateIsTimeToStartSpace}
            checked={isTimeToStartSpace}
            style={{ width: 20, height: 20 }}
          />
          <label>isTimeToStartSpace</label>
        </SectionItem>
      </Section>
      <SpaceWidgetComponent
        spaceId={spaceId}
        width={Number(width)}
        zIndex={Number(zIndex)}
        shareUrl={shareUrl}
        isHost={isHost}
        isLive={isLive}
        isJoined={isJoined}
        isMember={isMember}
        isTimeToStartSpace={isTimeToStartSpace}
      />
    </div>
  );
};

export default SpaceWidget;
