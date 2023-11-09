import { getGroupMembers } from './getGroupMembers';
import { getChatMemberCount } from './getChatMemberCount';
import { ChatMemberProfile, EnvOptionsType } from '../types';
import { getGroupMembersPublicKeys } from './getGroupMembersPublicKeys';

export const getAllGroupMembersPublicKeys = async (options: {
  chatId: string;
  env: EnvOptionsType['env'];
}): Promise<ChatMemberProfile[]> => {
  const { chatId, env } = options;
  const count = await getChatMemberCount({ chatId, env });
  const overallCount = count.approvedCount;
  const limit = 5000;
  const totalPages = Math.ceil(overallCount / limit);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const groupMembers: ChatMemberProfile[] = [];

  const memberFetchPromises = pageNumbers.map((page) =>
    getGroupMembersPublicKeys({ chatId, env, page, limit })
  );

  const membersResults = await Promise.all(memberFetchPromises);
  membersResults.forEach((result) => {
    if (result.members.length > 0) {
      groupMembers.push(...result.members);
    }
  });

  return groupMembers;
};
