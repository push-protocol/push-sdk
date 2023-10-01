import React, { useContext, useState } from 'react';
import { Section, Span } from '../../reusables';
import { MoreDarkIcon } from '../../../icons/MoreDark';
import { ThemeContext } from '../theme/ThemeProvider';
import styled from 'styled-components';
import { device } from '../../../config';
import Dropdown from '../reusables/DropDown';
import EditSvg from '../../../icons/EditSvg.svg';
import RemoveSvg from '../../../icons/RemoveSvg.svg';
import { ConditionArray } from '../exportedTypes';

export type CriteraValueType = {
    invertedIcon?: any;
    id: number;
    type?: string;
    title?: string;
    icon?: string;
    function: () => void;
};

interface CriteriaProps {
    width?: string;
    dropdownValues: ConditionArray[];
}

const Criteria = ({ dropdownValues, width = '100%' }: CriteriaProps) => {
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

    // can use the for the modal maybe

    const toggleDropdown = (criteriaId: number) => {
        if (openDropdownId === criteriaId) {
            // Clicked on an already open dropdown, so close it
            setOpenDropdownId(null);
        } else {
            // Clicked on a different criteria, so open its dropdown
            setOpenDropdownId(criteriaId);
        }
    };


    return (
        <Section flexDirection='column' gap='8px'>
            {/* we can reuse the code by creating a reusable component for it */}
            {dropdownValues &&
                dropdownValues.map((criteria, index) => (
                    <Section>
                        {criteria.length === 1 && criteria.map((singleCriteria) => (
                            <Section flexDirection='column'>
                                {singleCriteria.type && (
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
                                                {singleCriteria.category}
                                            </Span>
                                            <Span fontWeight='700'>
                                                {singleCriteria.type}{' '}
                                                <Span color={theme.textColor?.modalSubHeadingText}>or more</Span>
                                            </Span>
                                        </Section>
                                        <Section>
                                            <MoreDarkIcon />
                                        </Section>
                                    </CriteriaContainer>
                                )}
                                {singleCriteria.operator && (
                                    <Span color={theme.textColor?.modalSubHeadingText} background={theme.backgroundColor?.modalHoverBackground} padding='4px 8px 4px 8px' borderRadius='8px'>{singleCriteria.operator}</Span>
                                )}
                            </Section>
                        ))}
                        {criteria.length > 1 && (
                            <MainMultipleCriteriaContainer flexDirection='row'
                                borderWidth="1px"
                                justifyContent="center"
                                alignItems="center"
                                borderColor="#E6E7EE"
                                borderRadius="12px"
                                borderStyle="solid"
                                padding="8px 0px 8px 8px"
                                gap='0px 4px'
                                width='350px'
                            >
                                <Section
                                    flexDirection='column' gap='8px'>
                                    {criteria.map((singleCriteria) => (
                                        <Section>
                                            {singleCriteria.type && (
                                                <Section
                                                >
                                                    <MultipleCriteriaContainer
                                                        height='48px'
                                                        borderRadius='12px'
                                                        background={theme.backgroundColor?.modalHoverBackground}
                                                        padding='0px 4px 0px 12px'
                                                        justifyContent='space-between'
                                                        width={'220px'}
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
                                                                {singleCriteria.category}
                                                            </Span>
                                                            <Span fontWeight='700'>
                                                                {singleCriteria.type ? singleCriteria.type : singleCriteria.operator}{' '}
                                                                <Span color={theme.textColor?.modalSubHeadingText}>or more</Span>
                                                            </Span>
                                                        </Section>
                                                    </MultipleCriteriaContainer>
                                                </Section>
                                            )}
                                        </Section>
                                    ))}
                                </Section>
                                {criteria.map((singleCriteria) => (
                                    <Section>
                                        {singleCriteria.operator && !singleCriteria.type && (
                                            <Span color={theme.textColor?.modalSubHeadingText} background={theme.backgroundColor?.modalHoverBackground} padding='4px 8px 4px 8px' borderRadius='8px'>{singleCriteria.operator}</Span>
                                        )
                                        }
                                    </Section>
                                ))}
                                <Section>
                                    <MoreDarkIcon />
                                </Section>
                            </MainMultipleCriteriaContainer>
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

const MainMultipleCriteriaContainer = styled(Section)`
@media (max-width: 426px) {
    width: 280px;
}
`

const MultipleCriteriaContainer = styled(Section)`
@media (max-width: 426px) {
    width: 180px;
}
`