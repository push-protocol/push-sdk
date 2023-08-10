import { useContext, useEffect, useState } from "react";
import { Section, Span, Image } from "../../reusables";
import moment from "moment";
import styled from "styled-components";
import { FileMessageContent } from "../../../types";
import { FILE_ICON } from "../../../config";
import { formatFileSize, getPfp, pCAIP10ToWallet, setPfp, shortenText } from "../../../helpers";
import { checkTwitterUrl } from "../helpers/twitter";
import { IMessagePayload, TwitterFeedReturnType } from "../exportedTypes";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { ChatDataContext } from "../../../context";
import { useChatData } from "../../../hooks";
import { ThemeContext } from "../theme/ThemeProvider";

const SenderMessageAddress = ({ chat }: { chat: IMessagePayload }) => {
    const { account } = useContext(ChatDataContext)
    const theme = useContext(ThemeContext)
    return (
        <>
            {chat.fromCAIP10.split(":")[1] !== account && (
                <Span theme={theme} alignSelf="start"
                    textAlign="start" color={theme.textColorPrimary}>{chat.fromDID.split(":")[1].slice(0, 6)}...
                    {chat.fromDID.split(":")[1].slice(-6)}</Span>
            )}
        </>
    )
}

const SenderMessafeProfilePicture = ({ chat }: { chat: IMessagePayload }) => {
    const { account, env } = useContext(ChatDataContext)
    const [pfp, setPfp] = useState<string>("")
    const getUserPfp = async () => {
        const pfp = await getPfp({ account: chat.fromCAIP10.split(":")[1], env: env })
        if (pfp) {
            setPfp(pfp)
        }
    }
    useEffect(() => {
        getUserPfp()
    }, [account, chat.fromCAIP10])
    return (
        <Section justifyContent="start" alignItems="start">
            {chat.fromCAIP10.split(":")[1] !== account && (
                <Section alignItems="start">
                    {pfp && <Image src={pfp} alt="profile picture" width="40px" height="40px" borderRadius="50%" />}
                </Section>
            )}
        </Section>
    )
}

const MessageCard = ({
    chat,
    position,
    isGroup,
}: {
    chat: IMessagePayload;
    position: number;
    isGroup: boolean;
}) => {
    const theme = useContext(ThemeContext)
    const time = moment(chat.timestamp).format('hh:mm a');
    console.log(theme.chatBubblePrimaryBgColor)
    return (
        <Section theme={theme} flexDirection="row" justifyContent="start" gap="6px" width="fit-content">
            {isGroup &&
                <SenderMessafeProfilePicture chat={chat} />
            }
            <Section justifyContent="start" flexDirection="column"
            >
                {isGroup &&
                    <SenderMessageAddress chat={chat} />
                }
                <Section
                    gap="5px"
                    background={position ? `${theme.chatBubbleAccentBgColor}` : `${theme.chatBubblePrimaryBgColor}`}
                    padding="8px 12px"
                    borderRadius={position ? '12px 0px 12px 12px' : '0px 12px 12px 12px'}
                    margin="5px 0"
                    alignSelf={position ? 'end' : 'start'}
                    justifyContent="start"
                    maxWidth="80%"
                    minWidth="71px"
                    position="relative"
                    width="fit-content"
                    color={position ? `${theme.accentTextColor}` : `${theme.textColorPrimary}`}
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
                        color={position ? `${theme.accentTextColor}` : '#62626A'}
                        bottom="6px"
                        right="10px"
                    >
                        {time}
                    </Span>
                </Section>
            </Section>
        </Section>
    );
};

const FileCard = ({
    chat,
    isGroup,
}: {
    chat: IMessagePayload;
    position: number;
    isGroup: boolean;
}) => {
    const fileContent: FileMessageContent = JSON.parse(chat.messageContent);
    const name = fileContent.name;

    const content = fileContent.content as string;
    const size = fileContent.size;

    return (
        <Section flexDirection="row" justifyContent="start" gap="6px" width="fit-content">
            {isGroup &&
                <SenderMessafeProfilePicture chat={chat} />
            }
            <Section flexDirection="column">
                {isGroup &&
                    <SenderMessageAddress chat={chat} />
                }
                <Section
                    alignSelf="start"
                    maxWidth="100%"
                    margin="5px 0"
                    background="#343536"
                    borderRadius="8px"
                    justifyContent="space-around"
                    padding="10px 13px"
                    gap="15px"
                    width="fit-content"
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
            </Section>
        </Section>
    );
};

const ImageCard = ({
    chat,
    position,
    isGroup,
}: {
    chat: IMessagePayload;
    position: number;
    isGroup: boolean;
}) => {

    return (
        <Section flexDirection="row" justifyContent="start" gap="6px">
            {isGroup &&
                <SenderMessafeProfilePicture chat={chat} />
            }
            <Section justifyContent="start" flexDirection="column">
                {isGroup && (
                    <SenderMessageAddress chat={chat} />
                )}
                <Section
                    alignSelf={position ? 'end' : 'start'}
                    maxWidth="65%"
                    width="fit-content"
                    margin="5px 0"
                >
                    <Image
                        src={JSON.parse(chat.messageContent).content}
                        alt=""
                        width="100%"
                        borderRadius={position ? '12px 0px 12px 12px' : '0px 12px 12px 12px'}
                    />
                </Section>
            </Section>
        </Section>
    );
};

const GIFCard = ({
    chat,
    position,
    isGroup,
}: {
    chat: IMessagePayload;
    position: number;
    isGroup: boolean;
}) => {
    return (
        <Section flexDirection="row" justifyContent="start" gap="6px" width="fit-content">
            {isGroup &&
                <SenderMessafeProfilePicture chat={chat} />
            }
            <Section justifyContent="start" flexDirection="column">
                {isGroup &&
                    <SenderMessageAddress chat={chat} />
                }
                <Section
                    alignSelf={position ? 'end' : 'start'}
                    maxWidth="65%"
                    margin="5px 0"
                    width="fit-content"
                >
                    <Image
                        src={chat.messageContent}
                        alt=""
                        width="100%"
                        borderRadius={position ? '12px 0px 12px 12px' : '0px 12px 12px 12px'}
                    />
                </Section>
            </Section>
        </Section>
    );
};

const TwitterCard = ({ chat, tweetId, isGroup, position }: { chat: IMessagePayload, tweetId: string, isGroup: boolean, position: number }) => {
    return (
        <Section flexDirection="row" justifyContent="start" gap="6px" width="fit-content">
            {isGroup &&
                <SenderMessafeProfilePicture chat={chat} />
            }
            <Section justifyContent="start" flexDirection="column">
                {isGroup &&
                    <SenderMessageAddress chat={chat} />
                }
                <Section
                    alignSelf={position ? 'end' : 'start'}
                    maxWidth="100%"
                    width="fit-content"
                    margin="5px 0"
                >
                    <TwitterTweetEmbed tweetId={tweetId} />
                </Section>
            </Section>
        </Section>
    )
}

export const MessageBubble = ({ chat }: { chat: IMessagePayload }) => {
    const { account } = useChatData();
    const position = pCAIP10ToWallet(chat.fromDID).toLowerCase() !== account?.toLowerCase() ? 0 : 1;
    const { tweetId, messageType }: TwitterFeedReturnType = checkTwitterUrl({ message: chat?.messageContent });
    const [isGroup, setIsGroup] = useState<boolean>(false);
    useEffect(() => {
        if (chat.toDID.split(':')[0] === 'eip155') {
            if (isGroup) {
                setIsGroup(false);
            }
        } else {
            if (!isGroup) {
                setIsGroup(true);
            }
        }
    }, [chat.toDID, isGroup])

    if (messageType === 'TwitterFeedLink') {
        chat.messageType = 'TwitterFeedLink';
    }

    if (chat.messageType === 'GIF') {
        return <GIFCard isGroup={isGroup} chat={chat} position={position} />
    }
    if (chat.messageType === 'Image') {
        return <ImageCard isGroup={isGroup} chat={chat} position={position} />;
    }
    if (chat.messageType === 'File') {
        return <FileCard isGroup={isGroup} chat={chat} position={position} />;
    }
    if (chat.messageType === 'TwitterFeedLink') {
        return <TwitterCard tweetId={tweetId} isGroup={isGroup} chat={chat} position={position} />;
    }
    return <MessageCard isGroup={isGroup} chat={chat} position={position} />;
}


const FileDownloadIcon = styled.i`
  color: #575757;
`;

const FileDownloadIconAnchor = styled.a`
  font-size: 20px;
`;