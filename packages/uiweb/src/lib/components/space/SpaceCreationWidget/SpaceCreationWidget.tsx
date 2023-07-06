import { useState } from 'react'
import * as PushAPI from '@pushprotocol/restapi';

import { SCWCreateModal } from './SCWCreateModal/SCWCreateModal'
import { SCWScheduleModal } from './SCWScheduleModal/SCWScheduleModal';
import { SCWInviteModal } from './SCWInviteModal/SCWInviteModal';
import { SCWButton } from './SCWButton';

export interface ISpaceCreateWidgetProps {
    CustomComponent?: any;
}

export const SpaceCreationWidget:React.FC<ISpaceCreateWidgetProps> = (props) => {
    const { CustomComponent } = props;

    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
    const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);

    const [spaceState, setSpaceState] = useState({
        spaceName: '',
        spaceDescription: '',
        date: '',
        time: '',
    })

    const handleNameChange = (event: any) => {
        setSpaceState((prevState) => ({...prevState, spaceName: event.target.value}))
    };

    const handleDescriptionChange = (event: any) => {
        setSpaceState((prevState) => ({...prevState, spaceDescription: event.target.value}))
    };

    const onDateChange = (event: any) => {
        setSpaceState((prevState) => ({...prevState, date: event.target.value}))
    };

    const onTimeChange = (event: any) => {
        setSpaceState((prevState) => ({...prevState, time: event.target.value}))
    };

    const showCreateSpace = () => {
        setIsCreateModalVisible(!isCreateModalVisible);
        setIsScheduleModalVisible(false);
    }

    const showScheduleSpace = () => {
        setIsScheduleModalVisible(!isScheduleModalVisible);
        setIsCreateModalVisible(false);
        setIsInviteModalVisible(false);
    }

    const showInviteSpace = () => {
        setIsInviteModalVisible(!isInviteModalVisible);
        setIsScheduleModalVisible(false);
    }

    const closeCreateModal = () => {
        setIsCreateModalVisible(false);
    }

    const closeScheduleModal = () => {
        setIsScheduleModalVisible(false);
    }

    const closeInviteModal = () => {
        setIsInviteModalVisible(false);
    }

    
    const testCreateSpace = async () => {
        const spaceCreate = {
            spaceName: spaceState.spaceName,
            spaceDescription: 'string',
            members: ['0x9452BCAf507CD6547574b78B810a723d8868C85a', '0x2Fd463C32a3ba8118004c8BEd7FDdF789b8c3619'],
            spaceImage: 'asd',
            admins: ['0x2A7CFA3017DF1ED93A23DA2896466FE1D6A7FCAE', '0x2Fd463C32a3ba8118004c8BEd7FDdF789b8c3619'],
            isPublic: true,
            scheduleAt: new Date('2024-08-12T20:17:46.384Z'),
        }

        try {
        //   setLoading(true);
            // const librarySigner = await library.getSigner();
        
            // const response = await PushAPI.space.create(spaceCreate);
    
            // console.log(response);
        //   setSendResponse(response);
        } catch (e:any) {
            console.error(e.message);
        } finally {
        //   setLoading(false);
        }
    };

    return (
        <div>
            {
                CustomComponent
                ?
                <CustomComponent />
                :
                <SCWButton
                    onCreate={showCreateSpace}
                />
            }

            {spaceState.spaceName}
            {spaceState.date}
            {spaceState.time}

            {isCreateModalVisible &&
                <SCWCreateModal
                    isScheduleVisible={showScheduleSpace}
                    closeCreateModal={closeCreateModal}
                    nameValue={spaceState.spaceName}
                    descriptionValue={spaceState.spaceDescription}
                    handleNameChange={handleNameChange}
                    handleDescriptionChange={handleDescriptionChange}
                    isDescriptionEnabled={false}
                />
            }

            {isScheduleModalVisible &&
                <SCWScheduleModal
                    closeScheduleModal={closeScheduleModal}
                    makeCreateVisible={showCreateSpace}
                    makeInviteVisible={showInviteSpace}
                    dateValue={spaceState.date}
                    timeValue={spaceState.time}
                    onDateChange={onDateChange}
                    onTimeChange={onTimeChange}
                />
            }

            {isInviteModalVisible &&
                <SCWInviteModal
                    closeInviteModal={closeInviteModal}
                    makeScheduleVisible={showScheduleSpace}
                    createSpace={testCreateSpace}
                />
            }
        </div>
    )
}
