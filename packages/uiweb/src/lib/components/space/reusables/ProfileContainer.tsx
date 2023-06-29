import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../theme/ThemeProvider';

export interface IProfileContainerProps {
    name?: string;
    handle?: string;
    imageUrl?: string;
    tag?: string;
    imageHeight?: string;
    border?: boolean
}

export const ProfileContainer: React.FC<IProfileContainerProps> = ({
    name = "Host Name",
    handle = "Host Handle",
    imageUrl = "",
    tag,
    imageHeight,
    border = false,
}: IProfileContainerProps) => {
    const theme = useContext(ThemeContext);

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
            </HostContainer>
        </ParentContainer>
    );
};

const ParentContainer = styled.div<{ border?: boolean }>`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    padding: 8px 12px;

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
