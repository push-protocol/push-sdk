import { useContext, useState } from 'react';

import { IUser } from '@pushprotocol/restapi';
import { MdError } from 'react-icons/md';

import { findObject } from '../helpers/helper';
import { AddWallets } from '../reusables';
import { useChatData } from '../../../hooks';
import { pCAIP10ToWallet } from '../../../helpers';

type AddWalletContentProps = {
  onSubmit: () => void;
  onClose: () => void;
  handlePrevious: () => void;
  memberList: any;
  handleMemberList: any;
  isLoading?: boolean;
  isPublic: boolean;
};
export const AddGroupMembers = ({
  onSubmit,
  handlePrevious,
  onClose,
  memberList,
  handleMemberList,
  isLoading = false,
  isPublic,
}: AddWalletContentProps) => {
  const { user, toast } = useChatData();

  const addMemberToList = async (member: IUser) => {
    let errorMessage = '';
    if (pCAIP10ToWallet(member.wallets.toLowerCase()) === pCAIP10ToWallet((user?.account ?? '').toLowerCase())) {
      errorMessage = 'Group Creator cannot be added as member';
    }
    if (findObject(member, memberList, 'wallets')) {
      errorMessage = 'Address is already added';
    }
    if (errorMessage) {
      toast.showMessageToast({
        toastTitle: 'Error',
        toastMessage: errorMessage,
        toastType: 'ERROR',
        getToastIcon: (size: number) => (
          <MdError
            size={size}
            color="red"
          />
        ),
      });
    } else {
      const updatedMemberList = memberList;
      updatedMemberList.push({ ...member, isAdmin: false });
      handleMemberList(updatedMemberList);
    }
  };

  return (
    <AddWallets
      title="Create Group"
      submitButtonTitle="Create Group"
      addMemberToList={addMemberToList}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={isLoading}
      handlePrevious={handlePrevious}
      memberList={memberList}
      totalAllowedMembers={isPublic ? 25000 : 5000}
      handleMemberList={handleMemberList}
    />
  );
};
