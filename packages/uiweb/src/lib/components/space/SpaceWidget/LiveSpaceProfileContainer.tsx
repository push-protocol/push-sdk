import { Image, Item, Text } from "../../../config";

import HandIcon from '../../../icons/hand.svg';
import MicOffIcon from '../../../icons/micoff.svg';

export interface ILiveSpaceProfileContainerProps {
  profilePic: string;
  name: string;
  designation: string;
  requested?: boolean;
  mic?: boolean;
}

export const LiveSpaceProfileContainer = (options: ILiveSpaceProfileContainerProps) => {
  const {
    profilePic,
    name,
    designation,
    requested = false,
    mic = true
  } = options || {};

  return (
    <Item display={'flex'} flexDirection={'column'} alignItems={'center'} width={'118px'}>
      <Image src={profilePic} alt="Profile pic" height={'56px'} width={'56px'} borderRadius={'50%'} />
      <Text fontSize={'17px'} marginTop={'4px'} fontWeight={600}>{name}</Text>
      {requested
        ?
        <Item display={'flex'} marginTop={'5px'} fontWeight={600} gap={'4px'} alignItems={'center'}>
          <Text fontSize={'12px'} color={'#8B5CF6'}>Requested</Text>
          <Image 
            src={HandIcon}
            alt="Hand Icon"
            height={'15px'}
            width={'15px'}
          />
        </Item>
        :
        <Item display={'flex'} marginTop={'5px'} fontWeight={600} gap={'4px'} alignItems={'center'}>
          <Text fontSize={'14px'} color={'#71717A'}>{designation}</Text>
          {!mic &&
            <Image 
              src={MicOffIcon}
              alt="Mic Off Icon"
              height={'15px'}
              width={'15px'}
            />
          }
        </Item>
      }
    </Item>
  );
}
