import { NextPage } from 'next';
import { useSpaceComponents } from './../../components/Spaces/useSpaceComponent';
import Spaces from '.';

const SpaceInvitesComponent: NextPage = () => {
  const { SpaceInvitesComponent } = useSpaceComponents();

  return (
    <>
      <Spaces />
      <SpaceInvitesComponent />
    </>
  );
};

export default SpaceInvitesComponent;
