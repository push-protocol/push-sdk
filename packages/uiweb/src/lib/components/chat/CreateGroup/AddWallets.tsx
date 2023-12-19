import React from "react";
import { Section, Span } from "../../reusables";
import { ModalHeader } from "../reusables";
import { AddWalletContent } from "../ChatProfile/AddWalletContent";
import { GrouInfoType as GroupInfoType } from "../../chat/types/index"
import { ProfilePicture } from "../../../config";
import { MdCheckCircle, MdError } from "react-icons/md";
import { useCreateGatedGroup } from "../../../hooks/chat/useCreateGatedGroup";
import useToast from "../reusables/NewToast";
import { GroupInputDetailsType } from "./CreateGroupModal";

interface AddWalletsInCreateGroupProps {
    groupInputDetails: GroupInputDetailsType;
    setGroupInputDetails: React.Dispatch<React.SetStateAction<GroupInputDetailsType>>;
    groupMembers: string[];
    setGroupMembers: React.Dispatch<React.SetStateAction<string[]>>;
    groupAdmins: string[];
    criteriaStateManager: any;
    checked: boolean;
    groupEncryptionType: string;
    onClose: () => void;
    handlePrevious: () => void;
}

const AddWalletsInCreateGroup = ({ handlePrevious, onClose,groupInputDetails, groupEncryptionType, checked, criteriaStateManager, groupMembers, setGroupMembers }: AddWalletsInCreateGroupProps) => {
    const { createGatedGroup, loading } = useCreateGatedGroup();
    const groupInfoToast = useToast();
    const getEncryptionType = () => {
        if (groupEncryptionType === 'encrypted') {
            return false;
        }
        return true;
    };

    const showError = (errorMessage: string) => {
        groupInfoToast.showMessageToast({
            toastTitle: 'Error',
            toastMessage: errorMessage,
            toastType: 'ERROR',
            getToastIcon: (size) => <MdError size={size} color="red" />,
        });
    };

    const createGroupService = async () => {
        const groupInfo: GroupInfoType = {
            groupName: groupInputDetails.groupName,
            groupDescription: groupInputDetails.groupDescription,
            groupImage: groupInputDetails.groupImage || ProfilePicture,
            isPublic: getEncryptionType(),
            members: groupInputDetails.groupMembers.filter((member: any) => !member.isAdmin).map((member: any) => member.wallets),
            admins: groupInputDetails.groupMembers.filter((member: any) => member.isAdmin).map((member: any) => member.wallets),
        };
        const rules: any = checked ? criteriaStateManager.generateRule() : {};
        const isSuccess = await createGatedGroup(groupInfo, rules);
        if (isSuccess === true) {
            groupInfoToast.showMessageToast({
                toastTitle: 'Success',
                toastMessage: 'Group created successfully',
                toastType: 'SUCCESS',
                getToastIcon: (size: string | number | undefined) => <MdCheckCircle size={size} color="green" />,
            });
            onClose();
        } else {
            showError('Group creation failed');
        }
    }

    const verifyAndCreateGroup = async () => {
        if (groupEncryptionType.trim() === '') {
          showError('Group encryption type is not selected');
          return;
        }
    
        await createGroupService();
      };

    return (
        <Section>
            <AddWalletContent
                title="Create Group"
                submitButtonTitle="Create Group"
                onSubmit={verifyAndCreateGroup}
                onClose={onClose}
                handlePrevious={handlePrevious}
                memberList={groupMembers}
                handleMemberList={setGroupMembers}
                groupMembers={groupInputDetails.groupMembers}
                isLoading={loading}
                modalHeader="Add Wallets"
            />
        </Section>
    )
}

export default AddWalletsInCreateGroup;