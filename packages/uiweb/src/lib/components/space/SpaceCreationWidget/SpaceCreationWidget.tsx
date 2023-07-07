import { useState } from 'react'
import * as PushAPI from '@pushprotocol/restapi';

import { SCWCreateModal } from './SCWCreateModal/SCWCreateModal'
import { SCWScheduleModal } from './SCWScheduleModal/SCWScheduleModal';
import { SCWInviteModal } from './SCWInviteModal/SCWInviteModal';
import { SCWButton } from './SCWButton';

import { useSpaceData } from '../../../hooks';

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
        date: new Date(),
        time: new Date().getTime(),
    })

    const { signer } = useSpaceData();

    const handleNameChange = (event: any) => {
        setSpaceState((prevState) => ({...prevState, spaceName: event.target.value}))
    };

    const handleDescriptionChange = (event: any) => {
        setSpaceState((prevState) => ({...prevState, spaceDescription: event.target.value}))
    };

    const onDateChange = (dateValue: any) => {
        setSpaceState((prevState) => ({...prevState, date: dateValue}))
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

    console.log(typeof spaceState.date)
    console.log(typeof spaceState.time)
    
    const testCreateSpace = async () => {
        const spaceCreate = {
            spaceName: spaceState.spaceName,
            spaceDescription: 'Push Space',
            members: ['0x9452BCAf507CD6547574b78B810a723d8868C85a'],
            spaceImage: 'asd',
            admins: ['0x2A7CFA3017DF1ED93A23DA2896466FE1D6A7FCAE'],
            isPublic: true,
            scheduleAt: spaceState.date,
            signer: signer as PushAPI.SignerType,
        }

        try {
        //   setLoading(true);
        
            const response = await PushAPI.space.create(spaceCreate);
    
            console.log(response);
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
            {spaceState.date.toDateString()}
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
