import React, { useContext } from "react";
import { Section, Span, Image } from "../../reusables";
import moment from "moment";
import styled from "styled-components";
import { chat, type IMessageIPFS } from "@pushprotocol/restapi";
import { FileMessageContent } from "../../../types";
import { FILE_ICON } from "../../../config";
import { formatFileSize, pCAIP10ToWallet, shortenText } from "../../../helpers";


const MessageCard = ({
    chat,
    position,
}: {
    chat: IMessageIPFS;
    position: number;
}) => {
    const time = moment(chat.timestamp).format('hh:mm a');
    return (
        <Section
            gap="5px"
            background={position ? '#0D67FE' : '#EDEDEE'}
            padding="8px 12px"
            borderRadius={position ? '12px 12px 0px 12px' : '12px 12px 12px 0px'}
            margin="5px 0"
            alignSelf={position ? 'end' : 'start'}
            justifyContent="start"
            maxWidth="80%"
            minWidth="71px"
            position="relative"
            width="fit-content"
        >
            {' '}
            <Section flexDirection="column" padding="5px 0 15px 0">
                {chat.messageContent.split('\n').map((str) => (
                    <Span
                        key={Math.random().toString()}
                        alignSelf="start"
                        textAlign="left"
                        fontSize="16px"
                        fontWeight="400"
                        color={position ? '#fff' : '#000'}
                    >
                        {str}
                    </Span>
                ))}
            </Section>
            <Span
                position="absolute"
                fontSize="12px"
                fontWeight="400"
                color={position ? '#A9C8FF' : '#62626A'}
                bottom="6px"
                right="10px"
            >
                {time}
            </Span>
        </Section>
    );
};

const FileCard = ({
    chat,
    position,
}: {
    chat: IMessageIPFS;
    position: number;
}) => {
    const fileContent: FileMessageContent = JSON.parse(chat.messageContent);
    const name = fileContent.name;

    const content = fileContent.content as string;
    const size = fileContent.size;

    return (
        <Section
            alignSelf={position ? 'end' : 'start'}
            maxWidth="80%"
            margin="5px 0"
            background="#343536"
            borderRadius="8px"
            justifyContent="space-around"
            padding="10px 13px"
            gap="15px"
        >
            <Image
                src={FILE_ICON(name.split('.').slice(-1)[0])}
                alt="extension icon"
                width="20px"
                height="20px"
            />
            <Section flexDirection="column" gap="5px">
                <Span color="#fff" fontSize="15px">
                    {shortenText(name, 11)}
                </Span>
                <Span color="#fff" fontSize="12px">
                    {formatFileSize(size)}
                </Span>
            </Section>
            <FileDownloadIconAnchor
                href={content}
                target="_blank"
                rel="noopener noreferrer"
                download
            >
                <FileDownloadIcon className="fa fa-download" aria-hidden="true" />
            </FileDownloadIconAnchor>
        </Section>
    );
};

const ImageCard = ({
    chat,
    position,
}: {
    chat: IMessageIPFS;
    position: number;
}) => {
    return (
        <Section
            alignSelf={position ? 'end' : 'start'}
            maxWidth="65%"
            margin="5px 0"
        >
            <Image
                src={JSON.parse(chat.messageContent).content}
                alt=""
                width="100%"
                borderRadius={position ? '12px 12px 0px 12px' : '12px 12px 12px 0px'}
            />
        </Section>
    );
};

const GIFCard = ({
    chat,
    position,
}: {
    chat: IMessageIPFS;
    position: number;
}) => {
    return (
        <Section
            alignSelf={position ? 'end' : 'start'}
            maxWidth="65%"
            margin="5px 0"
        >
            <Image
                src={chat.messageContent}
                alt=""
                width="100%"
                borderRadius={position ? '12px 12px 0px 12px' : '12px 12px 12px 0px'}
            />
        </Section>
    );
};

export const MessageBubble = ({ chat, account }: { chat: IMessageIPFS, account: any }) => {
    const position = pCAIP10ToWallet(chat.fromDID).toLowerCase() !== account.toLowerCase() ? 0 : 1;

    if (chat.messageType === 'GIF') {
        return <GIFCard chat={chat} position={position} />;
    }
    if (chat.messageType === 'IMAGE') {
        return <ImageCard chat={chat} position={position} />;
    }
    if (chat.messageType === 'FILE') {
        return <FileCard chat={chat} position={position} />;
    }
    return <MessageCard chat={chat} position={position} />;
}


const FileDownloadIcon = styled.i`
  color: #575757;
`;

const FileDownloadIconAnchor = styled.a`
  font-size: 20px;
`;