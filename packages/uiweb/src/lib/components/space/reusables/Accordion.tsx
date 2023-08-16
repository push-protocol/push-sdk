import React, { useState, useContext } from 'react';
import styled from 'styled-components';

import CaretDownIcon from '../../../icons/CaretDownGrey.tsx';
import CaretUpIcon from '../../../icons/CaretUpGrey.svg';
import { ThemeContext } from '../theme/ThemeProvider';

interface IAccordionProps {
    title: string;
    items?: number;
    children: React.ReactNode;
}

const Accordion: React.FC<IAccordionProps> = ({ title, items, children }) => {
    const theme = useContext(ThemeContext)

    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen((prevIsOpen) => !prevIsOpen);
    };

    return (
        <AccordionParent>
            <AccordionTitle onClick={toggleAccordion}>
                <Title>
                    <div>{title}</div>
                    { items ? <PendingCount theme={theme}>{items}</PendingCount> : null }
                </Title>
                <Image
                    src={isOpen ? CaretUpIcon : CaretDownIcon}
                    alt="Maximize/Minimize icon"
                />
            </AccordionTitle>
            <AccordionBody isOpen={isOpen}>{children}</AccordionBody>
        </AccordionParent>
    );
};

export default Accordion;

/* styling */
const AccordionParent = styled.div`
    border:  1px solid #E4E4E7;
    border-radius: 8px;
    padding: 6.5px 0;
    margin: 16px 0;
`;

const AccordionBody = styled.div<{ isOpen: boolean }>`
    overflow-y: scroll;
    max-height: ${({ isOpen }) => (isOpen ? '200px' : '0')};
    transition: max-height 200ms ease-out;
`;

const AccordionTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 8px 16px;

    cursor: pointer;
`;

const Title = styled.div`
    display: flex;
    align-items: center;
`;

const PendingCount = styled.div`
    background: ${(props => props.theme.btnColorPrimary)};
    border-radius: 8px;
    padding: 4px 10px;
    margin-left: 6px;
    font-size: 13px;
    color: ${(props => props.theme.titleTextColor)};
`;

const Image = styled.img`
    display: flex;
    max-height: initial;
    vertical-align: middle;
    overflow: initial;
    cursor: pointer;
    height: ${(props: any): string => props.height || '24px'};
    width: ${(props: any): string => props.width || '20px'};
    align-self: center;
`;
