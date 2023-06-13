import { useState } from "react";
import { Section, SectionItem } from "../components/StyledComponents";
import SpaceUITest from "./SpaceUITest";
import { useSpaceComponents } from "./useSpaceComponents"

export const SpaceWidget = () => {
  const { SpaceWidgetComponent } = useSpaceComponents();
  const [spaceId, setSpaceId] = useState<string>('');

  const updateSpaceId = (e: React.SyntheticEvent<HTMLElement>) => {
    setSpaceId((e.target as HTMLInputElement).value);
  };

  return  (
    <div>
      <SpaceUITest />
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
      </Section>
      <SpaceWidgetComponent spaceId={spaceId} />
  </div>
  );
}