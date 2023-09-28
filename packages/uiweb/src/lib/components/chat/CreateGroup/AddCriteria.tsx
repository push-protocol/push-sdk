import React, { useState } from 'react'
import { DropDownInput, ModalHeader } from '../reusables'
import { Section } from '../../reusables'

interface AddCriteriaProps {
    handlePrevious?: () => void,
    handleNext?: () => void,
    handleClose?: () => void,
}

const AddCriteria = ({ handlePrevious, handleNext, handleClose }: AddCriteriaProps) => {
    const [selectedTypeValue, setSelectedTypeValue] = useState<string>('PUSH');
    const [selectedCategoryValue, setSelectedCategoryValue] = useState<string>('Select Something');
    const dropdownValues = [
        {
            id: 1,
            value: 'PUSH',
            title: 'Push Protocol',
            function: () => setSelectedTypeValue('PUSH'),
        },
        {
            id: 2,
            value: 'GUILD',
            title: 'GUILD',
            function: () => setSelectedTypeValue('GUILD'),
        }
    ]

    const dropdownCategoryValues = [
        {
            id: 0,
            value: 'ERC20',
            title: 'ERC20',
            function: () => setSelectedCategoryValue('ERC20'),
        },
        {
            id: 1,
            value: 'ERC721',
            title: 'ERC721',
            function: () => setSelectedCategoryValue('ERC721'),
        },
        {
            id: 2,
            value: 'INVITE',
            title: 'Invite',
            function: () => setSelectedCategoryValue('INVITE'),
        }, {
            id: 3,
            value: 'CustomEndpoint',
            title: 'Custom Endpoint',
            function: () => setSelectedCategoryValue('CustomEndpoint'),
        }
    ]

    return (
        <Section flexDirection='column' gap='10px'>
            <ModalHeader handleClose={() => console.log("Yooo")} handlePrevious={handlePrevious} title='Add Criteria' />
            <DropDownInput labelName='Type' selectedValue={selectedTypeValue} dropdownValues={dropdownValues} />
            <DropDownInput labelName='Category' selectedValue={selectedCategoryValue} dropdownValues={dropdownCategoryValues} />
        </Section>
    )
}

export default AddCriteria