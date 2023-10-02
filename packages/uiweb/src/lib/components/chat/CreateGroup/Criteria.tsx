import React, { useContext, useState } from 'react';
import { Section, Span } from '../../reusables';
import { MoreDarkIcon } from '../../../icons/MoreDark';
import { ThemeContext } from '../theme/ThemeProvider';
import styled from 'styled-components';
import { device } from '../../../config';
import Dropdown from '../reusables/DropDown';
import EditSvg from '../../../icons/EditSvg.svg';
import RemoveSvg from '../../../icons/RemoveSvg.svg';
import { ConditionType } from './Type';

export type CriteraValueType = {
    invertedIcon?: any;
    id: number;
    type?: string;
    title?: string;
    icon?: string;
    function: () => void;
};

interface CriteriaProps {
    dropdownValues: CriteraValueType[];
    // criteraType:
    conditionType:ConditionType
    width?: string;
}

const Criteria = ({ dropdownValues,conditionType,  width = '100%' }: CriteriaProps) => {
    const [selectedValue, setSelectedValue] = useState<number>(0);
    const [dropdownHeight, setDropdownHeight] = useState<number | undefined>(0);

    const dropDownValues = [
        {
            id: 0,
            value: 'Edit',
            title: 'Edit',
            icon: EditSvg,
            function: () => setSelectedValue(0),
        },
        {
            id: 1,
            value: 'Remove',
            title: 'Remove',
            icon: RemoveSvg,
            function: () => setSelectedValue(1),
        },
    ];
    const theme = useContext(ThemeContext);
    const [criteriaDetails, setCriteriaDetails] = useState<[]>([]);

    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

    const toggleDropdown = (criteriaId: number) => {
        if (openDropdownId === criteriaId) {
            // Clicked on an already open dropdown, so close it
            setOpenDropdownId(null);
        } else {
            // Clicked on a different criteria, so open its dropdown
            setOpenDropdownId(criteriaId);
        }
    };

    const showOrText = dropdownValues.length === 2; // Show "or" text if there are exactly 2 dropdowns

    return (
        <Section flexDirection='column' gap='8px'>
            {dropdownValues &&
                dropdownValues.map((criteria, index) => (
                    <Section key={criteria.id} alignItems='center' justifyContent='center' flexDirection='row' gap='8px'>
                        <CriteriaContainer
                            height='48px'
                            borderRadius='12px'
                            background={theme.backgroundColor?.modalHoverBackground}
                            padding='0px 4px 0px 12px'
                            justifyContent='space-between'
                            width={width}
                        >
                            <Section gap='4px'>
                                <Span
                                    alignSelf='center'
                                    background='#657795'
                                    borderRadius='4px'
                                    fontSize='13px'
                                    color={theme.textColor?.buttonText}
                                    padding='4px 8px 4px 8px'
                                >
                                    {criteria.type}
                                </Span>
                                <Span fontWeight='700'>
                                    {criteria.title}{' '}
                                    <Span color={theme.textColor?.modalSubHeadingText}>or more</Span>
                                </Span>
                            </Section>
                            {openDropdownId === criteria.id && (
                                <DropdownContainer
                                    style={{
                                        top: dropdownHeight! > 500 ? '30%' : '45%',
                                    }}
                                    theme={theme}
                                >
                                    <Dropdown dropdownValues={dropDownValues} />
                                </DropdownContainer>
                            )}
                            <Section>
                                <MoreDarkIcon />
                            </Section>
                        </CriteriaContainer>
                        {showOrText && index === 0 && (
                            <Span
                                borderRadius='12px'
                                color={theme.textColor?.modalSubHeadingText}
                                padding='4px 12px 4px 12px'
                                background='#F4F5FA'
                            >
                                {conditionType}
                            </Span>
                        )}
                    </Section>
                ))}
        </Section>
    );
};

export default Criteria;

const DropdownContainer = styled.div`
    position: absolute;
    left: 48%;
    top: 69%;
    border-radius: ${(props) => props.theme.borderRadius.modalInnerComponents};
    padding: 14px 8px;
    z-index: 999999999999 !important;
    display: flex;
    flex-direction: column !important;
    background: ${(props) => props.theme.backgroundColor.modalBackground};
    border: ${(props) => props.theme.border.modalInnerComponents};

    @media ${device.mobileL} {
        left: 27%;
    }
    @media (min-width: 426px) and (max-width: 1150px) {
        left: 48%;
    }
    @media (max-width: 480px) {
        left: 25%;
    }
`;

const CriteriaContainer = styled(Section)`
    @media (max-width: 426px) {
        width: 280px;
    }
`;
