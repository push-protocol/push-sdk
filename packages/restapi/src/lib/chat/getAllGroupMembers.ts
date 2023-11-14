import { getGroupMembers } from './getGroupMembers';
import { getGroupMemberCount } from './getGroupMemberCount';
import { ChatMemberProfile, EnvOptionsType } from '../types';

export const getAllGroupMembers = async (options: {
  chatId: string;
  env: EnvOptionsType['env'];
}): Promise<ChatMemberProfile[]> => {
  const { chatId, env } = options;
  const count = await getGroupMemberCount({ chatId, env });
  const overallCount = count.overallCount;
  const limit = 5000;
  const totalPages = Math.ceil(overallCount / limit);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const groupMembers: ChatMemberProfile[] = [];

  const memberFetchPromises = pageNumbers.map((page) =>
    getGroupMembers({ chatId, env, page, limit })
  );

  const membersResults = await Promise.all(memberFetchPromises);
  membersResults.forEach((result) => {
    if (result.length > 0) {
      groupMembers.push(...result);
    }
  });

  return groupMembers;
};
