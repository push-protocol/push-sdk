import { SpaceDTO } from '@pushprotocol/restapi';
import { isAccountsEqual } from '../../helpers/account';
import { getSpaceStatus } from '../../helpers/space';

export const isHostOfSpace = (account: string, spaceData: SpaceDTO) => {
  return isAccountsEqual(account, spaceData?.spaceCreator);
};

export const isMemberOfSpace = (account: string, spaceData: SpaceDTO) => {
  const isMemberArr = spaceData?.members.filter(
    (member) => isAccountsEqual(account, member.wallet)
  );
  return isMemberArr?.length > 0;
};

export const isLiveSpace = (spaceData: SpaceDTO) => {
  return getSpaceStatus(spaceData?.status) === 'Live';
};

export const isTimeToStart = (spaceData: SpaceDTO, now: Date) => {
  const isScheduled = spaceData?.status === 'PENDING';
  const scheduledTime = spaceData?.scheduleAt as Date;

  //true 15 min before scheduledTime
  if (scheduledTime && isScheduled) {
    return now.getTime() >= new Date(scheduledTime).getTime() - 15 * 60 * 1000;
  } else {
    return false;
  }
};
