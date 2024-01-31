import { useCallback, useState } from 'react';
import { useChatData } from './useChatData';
import { FetchGroupMembersResponseType } from '../../components/chat/types';
import { GroupParticipantCounts, ParticipantStatus } from '@pushprotocol/restapi';



interface fetchMembersParams {
  chatId:string;
  page:number,
  limit?:number,
  pending?:boolean,
  role?: string
}
interface fetchMemberStatusParams {
  chatId:string;
  accountId: string;
}

interface fetchMembersCountParams {
  chatId:string;
}


const useGroupMemberUtilities = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { account, env, user } = useChatData();


  const fetchMembers = useCallback(
    async ({ chatId ,page,limit=10,pending = false }: fetchMembersParams):Promise<FetchGroupMembersResponseType | undefined> => {
      setLoading(true);
      try {
        const response = await user?.chat.group.participants.list(chatId,{page,limit, filter: {
            pending,
          }});
          setLoading(false);
        return response;
      } catch(error: Error | any) {
        setLoading(false);
        console.log("err", error);
        setError(error.message);
        return error.message;
      }
    },
    [user, env, account]
  )

  const fetchMemberStatus = useCallback(
    async ({ chatId ,accountId }: fetchMemberStatusParams):Promise<ParticipantStatus | undefined>  => {
      setLoading(true);
      try {
        console.log(chatId,accountId,user)
        const response = await user?.chat.group.participants.status(chatId,accountId);
          setLoading(false);
        return response;
      } catch(error: Error | any) {
        setLoading(false);
        console.log("err", error);
        setError(error.message);
        return error.message;
      }
    },
    [account, env]
  )

  const fetchMembersCount = useCallback(
    async ({ chatId }:fetchMembersCountParams ):Promise<GroupParticipantCounts | undefined> => {
      setLoading(true);
      try {
        const response = await user?.chat.group.participants.count(chatId);
          setLoading(false);
        return response;
      } catch(error: Error | any) {
        setLoading(false);
        console.log("err", error);
        setError(error.message);
        return error.message;
      }
    },
    [user, env]
  )

  return { error, loading, fetchMembers,fetchMemberStatus,fetchMembersCount };
};

export default useGroupMemberUtilities;