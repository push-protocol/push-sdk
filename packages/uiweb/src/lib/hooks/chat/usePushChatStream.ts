/* eslint-disable react-hooks/rules-of-hooks */
import { CONSTANTS, PushAPI, SignerType } from '@pushprotocol/restapi';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ENV } from '../../config';
import { useChatData } from './useChatData';

export const usePushChatStream = () => {
  const { setIsPushChatStreamConnected, user } = useChatData();

  const [chatStream, setChatStream] = useState<any>({}); // to track any new messages
  const [chatAcceptStream, setChatAcceptStream] = useState<any>({}); // to track any new messages
  const [chatRejectStream, setChatRejectStream] = useState<any>({}); // to track any rejected request

  const [chatRequestStream, setChatRequestStream] = useState<any>({}); // any message in request
  const [participantRoleChangeStream, setParticipantRoleChangeStream] = useState<any>({}); // to track if a participant role is changed in a  group

  const [participantRemoveStream, setParticipantRemoveStream] = useState<any>({}); // to track if a participant is removed from group
  const [participantLeaveStream, setParticipantLeaveStream] = useState<any>({}); // to track if a participant leaves a group
  const [participantJoinStream, setParticipantJoinStream] = useState<any>({}); // to track if a participant joins a group
  const [groupCreateStream, setGroupCreateStream] = useState<any>({}); // to track if group is created

  const [groupUpdateStream, setGroupUpdateStream] = useState<any>({}); //group updation stream

  // maintain uid of stream
  const [currentStreamInfo, setCurrentStreamInfo] = useState({
    uid: null as string | null,
    streamUid: null as string | null,
  });

  const prevUID = useRef(null as string | null);
  const prevStreamUID = useRef(null as string | null);

  // const attachListenersAndConnect = async () => {
  //   user?.stream?.on(CONSTANTS.STREAM.CONNECT, (err: Error) => {
  //     console.debug('UIWeb::usePushChatStream::attachListenersAndConnect::CONNECT', user?.stream.uid);
  //     setIsPushChatStreamConnected(true);
  //   });

  //   user?.stream?.on(CONSTANTS.STREAM.DISCONNECT, (err: Error) => {
  //     console.debug('UIWeb::usePushChatStream::attachListenersAndConnect::DISCONNECT', user?.stream.uid);
  //     setIsPushChatStreamConnected(false);
  //   });

  //   //Listen for chat messages, your message, request, accept, rejected,
  //   user?.stream?.on(CONSTANTS.STREAM.CHAT, (message: any) => {
  //     console.debug('UIWeb::usePushChatStream::attachListenersAndConnect::CHAT', message);

  //     if (message.event === 'chat.request') {
  //       dispatchEvent(new CustomEvent('chatRequestStream', { detail: message }));
  //       setChatRequestStream(message);
  //     } else if (message.event === 'chat.accept') {
  //       dispatchEvent(new CustomEvent('chatAcceptStream', { detail: message }));
  //       setChatAcceptStream(message);
  //     } else if (message.event === 'chat.reject') {
  //       dispatchEvent(new CustomEvent('chatRejectStream', { detail: message }));
  //       setChatRejectStream(message);
  //     } else if (message.event === 'chat.group.participant.remove') {
  //       dispatchEvent(new CustomEvent('participantRemoveStream', { detail: message }));
  //       setParticipantRemoveStream(message);
  //     } else if (message.event === 'chat.group.participant.leave') {
  //       dispatchEvent(new CustomEvent('participantLeaveStream', { detail: message }));
  //       setParticipantLeaveStream(message);
  //     } else if (message.event === 'chat.group.participant.join') {
  //       dispatchEvent(new CustomEvent('participantJoinStream', { detail: message }));
  //       setParticipantJoinStream(message);
  //     } else if (message.event === 'chat.group.participant.role') {
  //       dispatchEvent(new CustomEvent('participantRoleChangeStream', { detail: message }));
  //       setParticipantRoleChangeStream(message);
  //     } else if (message.event === 'chat.message') {
  //       // dispatchEvent(new CustomEvent('chatStream', { detail: message }));
  //       setChatStream(message);
  //     }
  //   });

  //   // Listen for group info
  //   user?.stream?.on(CONSTANTS.STREAM.CHAT_OPS, (chatops: any) => {
  //     if (chatops.event === 'chat.group.update') {
  //       dispatchEvent(new CustomEvent('groupUpdateStream', { detail: chatops }));
  //       setGroupUpdateStream(chatops);
  //     } else if (chatops.event === 'chat.group.create') {
  //       dispatchEvent(new CustomEvent('groupCreateStream', { detail: chatops }));
  //       setGroupCreateStream(chatops);
  //     }
  //   });

  //   if (!user?.stream.connected()) {
  //     await user?.stream.connect();
  //     console.debug(
  //       'UIWeb::usePushChatStream::attachListenersAndConnect::Stream listeners attached and stream connected',
  //       user?.stream.uid
  //     );
  //   } else {
  //     console.debug('UIWeb::usePushChatStream::attachListenersAndConnect::Stream listeners attached', user?.stream.uid);
  //   }
  // };

  /** when the uid changes, change the listener hooks */
  // useEffect(() => {
  //   const setupListeners = async () => {
  //     if (currentStreamInfo.uid !== user?.uid && currentStreamInfo.streamUid !== user?.stream.uid) {
  //       console.debug(
  //         'UIWeb::usePushChatStream::useEffect::[currentStreamInfo] setupListeners | uid | streamUID',
  //         user?.uid,
  //         user?.stream.uid
  //       );
  //       await attachListenersAndConnect();
  //     }
  //   };

  //   setupListeners();
  // }, [currentStreamInfo]);

  /**
   * Whenever the requisite params to create a connection object change
   *  - disconnect the old connection
   *  - create a new connection object
   */
  // useEffect(() => {
  //   if (!user || (user?.uid === prevUID.current && user?.stream?.uid === prevStreamUID.current)) {
  //     return;
  //   }

  //   console.debug(
  //     `UIWeb::usePushChatStream::useEffect::[user] initStream Initiated - ${new Date().toISOString()} | user uid changed - ${
  //       user?.uid !== prevUID.current
  //     } | stream uid changed - ${user?.stream?.uid !== prevStreamUID.current} | ${user?.uid} | ${prevUID.current} | ${
  //       user?.stream?.uid
  //     } | ${prevStreamUID.current}`
  //   );

  //   // set current stream info so that this can't be called again
  //   prevUID.current = user?.uid ?? null;
  //   prevStreamUID.current = user?.stream?.uid ?? null;

  //   console.debug(
  //     `UIWeb::usePushChatStream::useEffect::[user] initStream Initiated Changed - ${new Date().toISOString()} | user uid changed - ${
  //       user?.uid !== prevUID.current
  //     } | stream uid changed - ${user?.stream?.uid !== prevStreamUID.current} | ${user?.uid} | ${prevUID.current} | ${
  //       user?.stream?.uid
  //     } | ${prevStreamUID.current}`
  //   );

  //   const initStream = async () => {
  //     let stream;

  //     // if user stream is not initialized
  //     if (!user.stream) {
  //       stream = await user?.initStream(
  //         [CONSTANTS.STREAM.CHAT, CONSTANTS.STREAM.CHAT_OPS, CONSTANTS.STREAM.CONNECT, CONSTANTS.STREAM.DISCONNECT],
  //         {
  //           connection: {
  //             retries: 3, // number of retries in case of error
  //           },
  //           raw: true,
  //         }
  //       );
  //       console.debug('UIWeb::usePushChatStream::useEffect::[user] stream created', user);
  //     }

  //     // if user stream is already initialized
  //     if (user.stream && !user?.readmode()) {
  //       // check what streams are already connected
  //       const connectedStreams = await user.stream.info();
  //       const streams = [
  //         CONSTANTS.STREAM.CHAT,
  //         CONSTANTS.STREAM.CHAT_OPS,
  //         CONSTANTS.STREAM.CONNECT,
  //         CONSTANTS.STREAM.DISCONNECT,
  //       ];

  //       // check and filter out the streams which are not connected
  //       const streamsToConnect = streams.filter((stream) => !connectedStreams.listen?.includes(stream));

  //       if (streamsToConnect.length) {
  //         stream = await user.stream?.reinit(streams, {
  //           connection: {
  //             retries: 3, // number of retries in case of error
  //           },
  //         });
  //       }
  //     }

  //     setCurrentStreamInfo({
  //       uid: user?.uid ?? null,
  //       streamUid: stream?.uid ?? null,
  //     });

  //     // set newly acquired stream info
  //     prevUID.current = user?.uid ?? null;
  //     prevStreamUID.current = user?.stream?.uid ?? null;

  //     await attachListenersAndConnect();

  //     // establish a new connection
  //     console.debug(
  //       `UIWeb::usePushChatStream::useEffect::[user] initStream Completed - ${new Date().toISOString()} | ${
  //         user?.uid
  //       } | ${prevUID.current} | ${user?.stream?.uid} | ${prevStreamUID.current}`
  //     );
  //   };

  //   //initStream();

  //   // Return a function to clean up the effect
  //   return () => {
  //     if (user && user.stream) {
  //       user.stream?.disconnect();
  //       console.debug('UIWeb::usePushChatStream::useEffect::[user] strean disconnected | uid', user.stream.uid);
  //     }
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user?.uid, user?.stream?.uid]);

  return {
    chatStream,
    chatRequestStream,
    chatAcceptStream,
    groupUpdateStream,
    chatRejectStream,
    participantRemoveStream,
    participantLeaveStream,
    participantJoinStream,
    participantRoleChangeStream,
    groupCreateStream,
  };
};
