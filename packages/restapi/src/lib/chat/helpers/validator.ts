import { isValidETHAddress, isValidNFTCAIP10Address } from '../../helpers';
import { GroupMemberUpdateOptions } from '../updateGroupMembers';

export const createGroupRequestValidator = (
  groupName: string,
  members: Array<string>,
  admins: Array<string>,
  groupDescription?: string | null,
  contractAddressNFT?: string,
  numberOfNFTs?: number,
  contractAddressERC20?: string,
  numberOfERC20?: number
): void => {
  if (groupName == null || groupName.length == 0) {
    throw new Error(`groupName cannot be null or empty`);
  }

  if (groupName.length > 50) {
    throw new Error(`groupName cannot be more than 50 characters`);
  }

  if (groupDescription && groupDescription.length > 150) {
    throw new Error(`groupDescription cannot be more than 150 characters`);
  }

  if (members == null) {
    throw new Error(`members cannot be null`);
  }

  for (let i = 0; i < members.length; i++) {
    if (members[i] && !isValidETHAddress(members[i])) {
      throw new Error(`Invalid member address!`);
    }
  }

  if (admins == null) {
    throw new Error(`admins cannot be null`);
  }

  for (let i = 0; i < admins.length; i++) {
    if (!isValidETHAddress(admins[i])) {
      throw new Error(`Invalid admin address!`);
    }
  }

  if (
    contractAddressNFT != null &&
    contractAddressNFT?.length > 0 &&
    !isValidNFTCAIP10Address(contractAddressNFT)
  ) {
    throw new Error(`Invalid contractAddressNFT address!`);
  }

  if (numberOfNFTs != null && numberOfNFTs < 0) {
    throw new Error(`numberOfNFTs cannot be negative number`);
  }

  if (
    contractAddressERC20 != null &&
    contractAddressERC20?.length > 0 &&
    !isValidNFTCAIP10Address(contractAddressERC20)
  ) {
    throw new Error(`Invalid contractAddressERC20 address!`);
  }

  if (numberOfERC20 != null && numberOfERC20 < 0) {
    throw new Error(`numberOfERC20 cannot be negative number`);
  }
};

export const createSpaceRequestValidator = (
  spaceName: string,
  spaceDescription: string | null,
  members: Array<string>,
  admins: Array<string>,
  contractAddressNFT?: string,
  numberOfNFTs?: number,
  contractAddressERC20?: string,
  numberOfERC20?: number
): void => {
  if (spaceName == null || spaceName.length == 0) {
    throw new Error(`spaceName cannot be null or empty`);
  }

  if (spaceName.length > 50) {
    throw new Error(`groupName cannot be more than 50 characters`);
  }

  if (spaceDescription && spaceDescription.length > 150) {
    throw new Error(`spaceDescription cannot be more than 150 characters`);
  }

  if (members == null) {
    throw new Error(`members cannot be null`);
  }

  for (let i = 0; i < members.length; i++) {
    if (members[i] && !isValidETHAddress(members[i])) {
      throw new Error(`Invalid member address!`);
    }
  }

  if (admins == null) {
    throw new Error(`admins cannot be null`);
  }

  for (let i = 0; i < admins.length; i++) {
    if (!isValidETHAddress(admins[i])) {
      throw new Error(`Invalid admin address!`);
    }
  }

  if (
    contractAddressNFT != null &&
    contractAddressNFT?.length > 0 &&
    !isValidNFTCAIP10Address(contractAddressNFT)
  ) {
    throw new Error(`Invalid contractAddressNFT address!`);
  }

  if (numberOfNFTs != null && numberOfNFTs < 0) {
    throw new Error(`numberOfNFTs cannot be negative number`);
  }

  if (
    contractAddressERC20 != null &&
    contractAddressERC20?.length > 0 &&
    !isValidNFTCAIP10Address(contractAddressERC20)
  ) {
    throw new Error(`Invalid contractAddressERC20 address!`);
  }

  if (numberOfERC20 != null && numberOfERC20 < 0) {
    throw new Error(`numberOfERC20 cannot be negative number`);
  }
};

export const validateScheduleDates = (
  scheduleAt?: Date | null,
  scheduleEnd?: Date | null
): void => {
  if (scheduleAt) {
    const start = new Date(scheduleAt);
    const now = new Date();

    if (start < now) {
      throw new Error('Schedule start time must be in the future.');
    }

    if (scheduleEnd) {
      const end = new Date(scheduleEnd);

      if (end < now) {
        throw new Error('Schedule end time must be in the future.');
      }

      if (start >= end) {
        throw new Error('Schedule start time must be earlier than end time.');
      }
    }
  }
};

export const updateGroupRequestValidator = (
  chatId: string,
  groupName: string,
  members: Array<string>,
  admins: Array<string>,
  address: string,
  groupDescription?: string | null
): void => {
  if (chatId == null || chatId.length == 0) {
    throw new Error(`chatId cannot be null or empty`);
  }

  if (groupName == null || groupName.length == 0) {
    throw new Error(`groupName cannot be null or empty`);
  }

  if (groupName != null && groupName.length > 50) {
    throw new Error(`groupName cannot be more than 50 characters`);
  }

  if (
    groupDescription &&
    groupDescription != null &&
    groupDescription.length > 150
  ) {
    throw new Error(`groupDescription cannot be more than 150 characters`);
  }

  if (members != null && members.length > 0) {
    for (let i = 0; i < members.length; i++) {
      if (!isValidETHAddress(members[i])) {
        throw new Error(`Invalid member address in members list!`);
      }
    }
  }

  if (admins != null && admins.length > 0) {
    for (let i = 0; i < admins.length; i++) {
      if (!isValidETHAddress(admins[i])) {
        throw new Error(`Invalid member address in admins list!`);
      }
    }
  }

  if (address != null && !isValidETHAddress(address)) {
    throw new Error(`Invalid address field!`);
  }
};

export const validateGroupMemberUpdateOptions = (
  options: GroupMemberUpdateOptions
): void => {
  const { chatId, upsert, remove } = options;

  if (!chatId || chatId.trim().length === 0) {
    throw new Error('Chat ID cannot be null or empty.');
  }

  // Validating upsert object
  const allowedRoles = ['members', 'admins']; // Define allowed roles
  Object.keys(upsert).forEach((role) => {
    if (!allowedRoles.includes(role)) {
      throw new Error(
        `Invalid role: ${role}. Allowed roles are ${allowedRoles.join(', ')}.`
      );
    }
   
    // Assuming you have a function `isValidETHAddress` to validate Ethereum addresses
    upsert[role].forEach((address) => {
      if (!isValidETHAddress(address)) {
        throw new Error(`Invalid address found in ${role} list.`);
      }
    });
  });

  // Validating remove array
  if (remove && remove.length > 100) {
    throw new Error('Remove array cannot have more than 100 addresses.');
  }
  remove.forEach((address) => {
    if (!isValidETHAddress(address)) {
      throw new Error('Invalid address found in remove list.');
    }
  });
};
