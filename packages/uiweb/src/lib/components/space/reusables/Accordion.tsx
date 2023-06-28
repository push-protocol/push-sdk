import React, { useState } from 'react';
import styled from 'styled-components';

import CaretDownIcon from '../../../icons/CaretDownGrey.svg';
import CaretUpIcon from '../../../icons/CaretUpGrey.svg';

interface IAccordionProps {
    title: string;
    children: React.ReactNode;
}

const Accordion: React.FC<IAccordionProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleAccordion = () => {
        setIsOpen((prevIsOpen) => !prevIsOpen);
    };

    return (
        <AccordionParent>
            <AccordionTitle onClick={toggleAccordion}>
                <Title>
                    <div>{title}</div>
                    <PendingCount>2</PendingCount>
                </Title>
                <Image
                    src={isOpen ? CaretUpIcon : CaretDownIcon}
                    alt="Maximize/Minimize icon"
                />
            </AccordionTitle>
            {isOpen ? <AccordionBody>{children}</AccordionBody> : null}
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

const AccordionBody = styled.div`
    max-height: 200px;
    overflow-y: scroll;
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
    background: #8B5CF6;
    border-radius: 8px;
    padding: 4px 10px;
    margin-left: 6px;
    font-size: 13px;
    color: white;
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