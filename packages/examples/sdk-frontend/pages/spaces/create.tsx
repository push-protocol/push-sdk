import { NextPage } from 'next';
import { useSpaceComponents } from './../../components/Spaces/useSpaceComponent';
import Spaces from '.';

const CreateSpaceComponent: NextPage = () => {
  const { CreateSpaceComponent } = useSpaceComponents();

  return (
    <>
      <Spaces />
      <CreateSpaceComponent />
    </>
  );
};

export default CreateSpaceComponent;
