import { ILiveSpaceProfileContainerProps, LiveSpaceProfileContainer } from "./LiveSpaceProfileContainer";

import { Button, Image, Item, Text } from "../../../config";
import MicOnIcon from '../../../icons/micon.svg';
import ShareIcon from '../../../icons/Share.svg';
import MembersIcon from '../../../icons/Members.svg';

const tempImageUrl = "https://imgv3.fotor.com/images/blog-richtext-image/10-profile-picture-ideas-to-make-you-stand-out.jpg";

const LiveProfilesInSpace: Array<ILiveSpaceProfileContainerProps> = [
  {
    profilePic: tempImageUrl,
    name: 'Ethan',
    designation: 'Host'
  },
  {
    profilePic: tempImageUrl,
    name: 'James',
    designation: 'Co-host',
    mic: false
  },
  {
    profilePic: tempImageUrl,
    name: 'Ava',
    designation: 'Co-host',
    mic: false
  },
  {
    profilePic: tempImageUrl,
    name: 'Charlotte',
    designation: 'Speaker'
  },
  {
    profilePic: tempImageUrl,
    name: 'Noah',
    designation: 'Listener',
    requested: true
  },
  {
    profilePic: tempImageUrl,
    name: 'William',
    designation: 'Listener',
    requested: true
  },
  {
    profilePic: tempImageUrl,
    name: 'Crypto',
    designation: 'Listener'
  },
  {
    profilePic: tempImageUrl,
    name: 'Harper',
    designation: 'Listener'
  },
  {
    profilePic: tempImageUrl,
    name: 'Gabriel',
    designation: 'Listener'
  },
  {
    profilePic: tempImageUrl,
    name: 'cjdbsjc',
    designation: 'Listener'
  },
  {
    profilePic: tempImageUrl,
    name: 'clisdjc',
    designation: 'Listener'
  },
  {
    profilePic: tempImageUrl,
    name: 'oksxo',
    designation: 'Listener'
  },
  {
    profilePic: tempImageUrl,
    name: 'xasp[xp',
    designation: 'Listener'
  },
  {
    profilePic: tempImageUrl,
    name: 'ixccdcd',
    designation: 'Listener'
  }
]

interface LiveWidgetContentProps {
  // temp props only for testing demo purpose for now
  isHost?: boolean;
  isJoined?: boolean;
}
export const LiveWidgetContent: React.FC<LiveWidgetContentProps> = ({ isJoined, isHost }) => {
  return (
    <>
      <Item flex={'1'} display={'flex'} padding={'16px 10px'} flexWrap={'wrap'} justifyContent={'flex-start'} gap={'24px 12px'} overflowY={'auto'} alignContent={'flex-start'}>
        {
          LiveProfilesInSpace.map((profile) => <LiveSpaceProfileContainer {...profile} />)
        }
      </Item>
      <Item padding={'28px 10px'} width={'90%'}>
        {isJoined
          ?
            <Item 
              borderRadius={'8px'}
              background={'#EDE9FE'}
              display={'flex'}
              justifyContent={'space-between'}
              padding={'6px 8px'}
            >
              <Item cursor={'pointer'} display={'flex'} alignItems={'center'} gap={'8px'} padding={'10px'}>
                <Image
                  width={'14px'}
                  height={'20px'}
                  src={MicOnIcon}
                  alt="Mic Icon"
                />
                <Text color="#8B5CF6" fontSize={'14px'} fontWeight={600}>Request</Text>
              </Item>
              <Item display={'flex'} alignItems={'center'} gap={'16px'}>
                <Image
                  width={'21px'}
                  height={'24px'}
                  src={MembersIcon}
                  cursor={'pointer'}
                  alt="Members Icon"
                />
                <Image
                  width={'24px'}
                  height={'24px'}
                  src={ShareIcon}
                  cursor={'pointer'}
                  alt="Share Icon"
                />
                <Button 
                  color="#8B5CF6" 
                  fontSize={'14px'} 
                  fontWeight={600} 
                  width={'100px'}
                  height={'100%'}
                  cursor={'pointer'}
                  border={'1px solid #8B5CF6'}
                  borderRadius={'12px'}
                >
                  {!isHost ? 'Leave' : 'End space'}
                </Button>
              </Item>
            </Item>
          :
            <Button 
              height={'36px'} 
              width={'100%'}
              border={'none'}
              borderRadius={'8px'}
              cursor={'pointer'}
              background={'linear-gradient(87.17deg, #EA4EE4 0%, #D23CDF 0.01%, #8B5CF6 100%), linear-gradient(87.17deg, #EA4E93 0%, #DB2777 0.01%, #9963F7 100%), linear-gradient(87.17deg, #B6A0F5 0%, #F46EF7 50.52%, #FFDED3 100%, #FFCFC5 100%), linear-gradient(0deg, #8B5CF6, #8B5CF6), linear-gradient(87.17deg, #B6A0F5 0%, #F46EF7 57.29%, #FF95D5 100%), #FFFFFF'}
            >
              <Text color="white" fontSize={'16px'} fontWeight={'600'}>Join this space</Text>
            </Button>
        }
      </Item>
    </>
  );
}
