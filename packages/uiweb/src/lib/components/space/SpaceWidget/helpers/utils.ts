import { SpaceDTO } from '@pushprotocol/restapi';
import { getSpaceStatus } from '../../helpers/space';

export const isHostOfSpace = (account: string, spaceData: SpaceDTO) => {
  return (
    account.toUpperCase() === spaceData?.spaceCreator.slice(7).toUpperCase()
  );
};

export const isMemberOfSpace = (account: string, spaceData: SpaceDTO) => {
  const isMemberArr = spaceData?.members.filter(
    (member) => member.wallet.slice(7).toUpperCase() === account.toUpperCase()
  );
  return isMemberArr?.length > 0;
};

export const isLiveSpace = (spaceData: SpaceDTO) => {
  return getSpaceStatus(spaceData) === 'Live';
};

export const isTimeToStart = (spaceData: SpaceDTO) => {
  const now = new Date();
  const isScheduled = spaceData?.status === 'PENDING';
  const scheduledTime = spaceData?.scheduleAt as Date;

  //true 15 min before scheduledTime
  if (scheduledTime && isScheduled) {
    console.log(scheduledTime);
    return now.getTime() >= new Date(scheduledTime).getTime() - 15 * 60 * 1000;
  } else {
    return false;
  }
};
