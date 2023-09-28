import React, { useState } from 'react'
import { DropDownInput, ModalHeader } from '../reusables'
import { Section } from '../../reusables'
import { EthereumIcon } from '../../../icons/Ethereum';
import { PolygonIcon } from '../../../icons/PolygonIcon';
import { BSC } from '../../../icons/Bsc';

interface AddCriteriaProps {
    handlePrevious?: () => void,
    handleNext?: () => void,
    handleClose?: () => void,
}

const AddCriteria = ({ handlePrevious, handleNext, handleClose }: AddCriteriaProps) => {
    const [selectedTypeValue, setSelectedTypeValue] = useState<string>('PUSH');
    const [selectedCategoryValue, setSelectedCategoryValue] = useState<string>('ERC20');
    const [selectedSubCategoryValue, setSelectedSubCategoryValue] = useState<string>('Holder');
    const [selectedChainValue, setSelectedChainValue] = useState<string>('Ethereum');
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
            value: 'Token ERC20',
            title: 'Token ERC20',
            function: () => setSelectedCategoryValue('Token ERC20'),
        },
        {
            id: 1,
            value: 'NFT ERC721',
            title: 'NFT ERC721',
            function: () => setSelectedCategoryValue('NFT ERC721'),
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

    const dropdownSubCategoryValues = [
        {
            id: 0,
            value: 'Holder',
            title: 'Holder',
            function: () => setSelectedSubCategoryValue('Holder'),
        }, {
            id: 1,
            value: 'Owner',
            title: 'Owner',
            function: () => setSelectedSubCategoryValue('Owner'),
        }
    ]

    const dropdownChains = [
        {
            id: 0,
            value: 'Ethereum',
            title: 'Ethereum',
            invertedIcon: <EthereumIcon />,
            function: () => setSelectedChainValue('Ethereum'),
        },
        {
            id: 1,
            value: 'Polygon',
            title: 'Polygon',
            invertedIcon: <PolygonIcon />,
            function: () => setSelectedChainValue('Polygon'),
        }, {
            id: 2,
            value: 'BSC',
            title: 'BSC',
            invertedIcon: <BSC />,
            function: () => setSelectedChainValue('BSC'),
        }
    ]

    return (
        <Section flexDirection='column' gap='10px'>
            <ModalHeader handleClose={() => console.log("Yooo")} handlePrevious={handlePrevious} title='Add Criteria' />
            <DropDownInput labelName='Type' selectedValue={selectedTypeValue} dropdownValues={dropdownValues} />
            <DropDownInput labelName='Gating Category' selectedValue={selectedCategoryValue} dropdownValues={dropdownCategoryValues} />
            <DropDownInput labelName='Sub-category' selectedValue={selectedSubCategoryValue} dropdownValues={dropdownSubCategoryValues} />
            <DropDownInput labelName='Blockchain' selectedValue={selectedChainValue} dropdownValues={dropdownChains} />
        </Section>
    )
}

export default AddCriteria