import { useEffect, useState } from 'react';
import { useSpaceData } from './useSpaceData';
import { ISpaceDataContextValues } from '../../context/spacesContext';
import { SpaceDTO } from '@pushprotocol/restapi';

type Profile = {
  name?: string;
  image?: string;
  handle?: string;
}
type MembersValueType = SpaceDTO['members'][number];
type CustomizedMembersValueType = MembersValueType & Profile;

export const useGetCustomizeProfile = (account?: string, profile?: MembersValueType): CustomizedMembersValueType | undefined => {
  const { customizeProfile: { customizeProfile } }: ISpaceDataContextValues = useSpaceData();
  const [customizedProfile, setCustomizedProfile] = useState<Profile | undefined>(profile);

  console.log(account, profile);

  useEffect(() => {
    if(!profile || !account) {
      return;
    }

    const fetchData = async () => {
      try {
        const response = await customizeProfile(account);
        console.log(response, profile);
        setCustomizedProfile({...profile, ...response});
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [account, profile]);

  if (!profile) {
    return undefined;
  }

  const customizedMembersProfile: CustomizedMembersValueType = {
    ...profile,
    ...(customizedProfile || {}),
  };

  return customizedMembersProfile;
};
