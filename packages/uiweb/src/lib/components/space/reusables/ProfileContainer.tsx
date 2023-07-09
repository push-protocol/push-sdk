import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../theme/ThemeProvider';

export interface IProfileContainerProps {
    name?: string;
    handle?: string;
    imageUrl?: string;
    tag?: string;
    imageHeight?: string;
    border?: boolean;
    contBtn?: any;
    btnCallback?: any;
    removeCallback?: any;
    promoteCallback?: any;
}

export const ProfileContainer: React.FC<IProfileContainerProps> = ({
    name = "Host Name",
    handle = "Host Handle",
    imageUrl = "",
    tag,
    imageHeight,
    border = false,
    contBtn,
    btnCallback,
    removeCallback,
    promoteCallback,
}: IProfileContainerProps) => {
    const theme = useContext(ThemeContext);

    const [isDDOpen, setIsDDOpen] = useState(false)

    const handleDDState = () => {
        setIsDDOpen(!isDDOpen)
    }

    return (
        <ParentContainer
            border={border}
        >
            <PfpContainer>
                <Pfp src={imageUrl} alt="host pfp" imageHeight={imageHeight} />
            </PfpContainer>
            <HostContainer>
                <ProfileDetails>
                    <HostName>
                        <Name>{name}</Name>
                    </HostName>
                    {handle &&
                        <HostHandle theme={theme}>
                        {/* Fetch the handle from Lenster */}@{handle}
                        </HostHandle>
                    }
                </ProfileDetails>
                { tag ? <Host>{tag}</Host> : null }
                { contBtn ? <div onClick={btnCallback ?? handleDDState}>{contBtn}</div> : null }
            </HostContainer>

            {
                isDDOpen ?
                <DropDown theme={theme}>
                    <DDItem onClick={removeCallback}>
                        Remove
                    </DDItem>

                    <DDItem onClick={promoteCallback}>
                        Make Admin
                    </DDItem>

                    <DDItem onClick={handleDDState}>
                        Close <br/> This Dropdown
                    </DDItem>
                </DropDown>
                : null
            }
        </ParentContainer>
    );
};

const ParentContainer = styled.div<{ border?: boolean }>`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    position: relative;

    padding: 8px 16px;

    border: ${(props => props.border ? '1px solid #E4E4E7' : 'none')};
    border-radius: 16px;
`;

const PfpContainer = styled.div`
    display: flex;
`;

const Pfp = styled.img<{ imageHeight?: string }>`
    height: ${(props) => (props.imageHeight ?? '32px')};
    width: ${(props) => (props.imageHeight ?? '32px')};;
    border-radius: 50%;
`;

const HostContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-left: 8px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ProfileDetails = styled.div`
    display: flex;
    flex-direction: column;

    flex-grow: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    width: 200px;
`;

const HostName = styled.div`
    display: flex;
    flex-direction: row;
    font-weight: 600;
    font-size: 15px;
    width: 100%;
`;

const Name = styled.span`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`;

const Host = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 8px;
    line-height: 18px;
    width: max-content;
    background: rgba(139, 92, 246, 0.2);
    color: #8B5CF6;
    border-radius: 6px;
    font-weight: 500;
    font-size: 12px;
    padding: 6px 10px;
    border-radius: 8px;
`;

const HostHandle = styled.div<{ theme?: any }>`
    background: ${(props => props.theme.textGradient)};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    padding: 0;
    font-weight: 450;
    font-size: 14px;
    line-height: 130%;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`;

const DropDown = styled.div<{ theme?: any }>`
    position: absolute;
    top: 0px;
    right: 0px;

    display: flex;
    flex-direction: column;
    gap: 12px;

    justify-content: center;
    align-items: start;

    padding: 16px;
    background: ${(props => props.theme.bgColorPrimary)};
    color: ${(props => props.theme.textColorPrimary)};
    border-radius: 16px;

    border: 1px solid ${(props => props.theme.borderColor)};
`;

const DDItem = styled.div`
    cursor: pointer;
`;