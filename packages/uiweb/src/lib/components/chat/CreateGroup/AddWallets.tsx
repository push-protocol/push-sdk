import React from "react";
import { Section, Span } from "../../reusables";
import { ModalHeader } from "../reusables";
import { AddWalletContent } from "../ChatProfile/AddWalletContent";

interface AddWalletsInCreateGroupProps {
    groupInputDetails: any;
    setGroupInputDetails: any;
    groupMembers: any;
    setGroupMembers: any;
    groupAdmins: any;
    setGroupAdmins: any;
}

const AddWalletsInCreateGroup = ({ groupInputDetails, setGroupInputDetails, groupMembers, setGroupMembers, groupAdmins, setGroupAdmins }: AddWalletsInCreateGroupProps) => {
    return (
        <Section>
            <AddWalletContent
            title="Create Group"
            submitButtonTitle="Create Group"
                onSubmit={() => {
                    console.log("in submit", groupInputDetails);
                }}
                onClose={() => {
                    console.log("in close");
                }}
                handlePrevious={() => {
                    console.log("in handle previous");
                }}
                memberList={groupMembers}
                handleMemberList={setGroupMembers}
                groupMembers={groupInputDetails.groupMembers}
                isLoading={false}
                modalHeader="Add Wallets"
            />
        </Section>
    )
}

export default AddWalletsInCreateGroup;