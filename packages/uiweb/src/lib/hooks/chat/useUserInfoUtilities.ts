import { useCallback, useState } from 'react';

import { PushAPI } from '@pushprotocol/restapi';

import { useChatData } from './index';
import { UserProfileType } from '../../components/chat/UserProfile/UpdateUserProfileModal';

export interface FetchEncryptionInfoParams {
  user: PushAPI;
}
export interface UpdateUserProfileParams {
  userProfileDetails: UserProfileType;
}

const useUserInfoUtilities = () => {
  const { user } = useChatData();
  const [updateProfileLoading, setUpdateProfileLoading] = useState<boolean>(false);

  const fetchProfileInfo = useCallback(
    async ({ recipient }: { recipient: string }): Promise<any> => {
      try {
        const profileResponse = await user?.profile.info({
          overrideAccount: recipient,
        });

        return profileResponse;
      } catch (error) {
        console.log(error);
        return;
      }
    },
    [user]
  );

  const fetchEncryptionInfo = useCallback(async (): Promise<any> => {
    try {
      const encryptionResponse = await user?.encryption.info();

      return encryptionResponse;
    } catch (error) {
      console.log(error);
      return;
    }
  }, [user]);
  const updateUserProfile = useCallback(
    async ({ userProfileDetails }: UpdateUserProfileParams): Promise<any> => {
      try {
        setUpdateProfileLoading(true);
        const updatedProfile = await user?.profile.update({
          name: userProfileDetails.name,
          desc: userProfileDetails.description,
          picture: userProfileDetails.picture,
        });
        setUpdateProfileLoading(false);

        return updatedProfile;
      } catch (error: Error | any) {
        setUpdateProfileLoading(false);
        console.log(error);
        return error.message;
      }
    },
    [user]
  );
  return { fetchEncryptionInfo, updateUserProfile, fetchProfileInfo, updateProfileLoading };
};

export default useUserInfoUtilities;
