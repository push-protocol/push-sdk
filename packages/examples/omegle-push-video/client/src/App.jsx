import React, {useEffect, useRef, useReducer} from "react";
import io from "socket.io-client";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useAccount, useWalletClient} from "wagmi";
import {CONSTANTS, PushAPI} from "@pushprotocol/restapi";

import {appReducer, actionTypes} from "./reducer";
import Modal from "./components/Modal";
import Video from "./video";
import Loader from "./components/Loader";

function App() {
  const socket = useRef(null);
  const userAlice = useRef();
  const {data: signer} = useWalletClient();
  const {address: walletAddress, isConnected: walletConnected} = useAccount();
  const [
    {
      isPeerConnected,
      peerWalletAddress,
      showPeerDisconnectedModal,
      showNoActivePeersModal,
      peerMatched,
      videoCallInitiator,
      userActive,
      incomingPeerRequest,
    },
    dispatch,
  ] = useReducer(appReducer, {
    isPeerConnected: false,
    peerWalletAddress: "",
    showPeerDisconnectedModal: false,
    showNoActivePeersModal: false,
    peerMatched: false,
    videoCallInitiator: "",
    userActive: true,
    incomingPeerRequest: false,
  });

  const connectToPeer = () => {
    socket.current.emit("connect_to_peer", walletAddress);
  };

  const setupSocketListeners = () => {
    socket.current.on("peer_matched", (peerAddress) => {
      dispatch({type: actionTypes.SET_PEER_MATCHED, payload: true});
      checkIfChatExists(peerAddress);
      dispatch({
        type: actionTypes.SET_VIDEO_CALL_INITIATOR,
        payload: walletAddress,
      });
    });
    socket.current.on("incoming_peer_request", () => {
      dispatch({type: actionTypes.SET_INCOMING_PEER_REQUEST, payload: true});
    });
    socket.current.on("intent_accepted_by_peer", async (peerAddress) => {
      dispatch({type: actionTypes.SET_IS_PEER_CONNECTED, payload: true});
    });
    socket.current.on("chat_exists_bw_users", async (peerAddress) => {
      dispatch({type: actionTypes.SET_IS_PEER_CONNECTED, payload: true});
    });
    socket.current.on("no_active_peers_found", () => {
      dispatch({
        type: actionTypes.SET_SHOW_NO_ACTIVE_PEERS_MODAL,
        payload: true,
      });
    });
    socket.current.on("peer_disconnected", () => {
      dispatch({type: actionTypes.SET_IS_PEER_CONNECTED, payload: false});
      dispatch({type: actionTypes.SET_INCOMING_PEER_REQUEST, payload: false});
      dispatch({type: actionTypes.SET_PEER_WALLET_ADDRESS, payload: ""});
      dispatch({type: actionTypes.SET_PEER_MATCHED, payload: false});
      dispatch({
        type: actionTypes.SET_SHOW_PEER_DISCONNECTED_MODAL,
        payload: true,
      });
    });

    socket.current.on("chat_message_request", async (peerAddress) => {
      const aliceChatRequsts = await userAlice.current.chat.list("REQUESTS");
      for (const chat of aliceChatRequsts) {
        if (
          chat.msg.fromDID &&
          chat.msg.fromDID.substring(7).toLowerCase() ===
            peerAddress.toLowerCase()
        ) {
          await userAlice.current.chat.accept(peerAddress);
          break;
        }
      }

      socket.current.emit("intent_accepted", peerAddress);
    });

    socket.current.on("peer_disconnected_call", async (peerAddress) => {
      dispatch({type: actionTypes.SET_IS_PEER_CONNECTED, payload: false});
      dispatch({type: actionTypes.SET_INCOMING_PEER_REQUEST, payload: false});
      dispatch({type: actionTypes.SET_PEER_MATCHED, payload: false});
      window.location.reload();
    });
  };

  const checkIfChatExists = async (peerAddress) => {
    if (!userAlice.current) {
      window.location.reload();
      return;
    }
    const aliceChats = await userAlice.current.chat.list("CHATS");

    let chatExists = false;
    for (const chat of aliceChats) {
      if (
        chat.msg.fromDID &&
        chat.msg.fromDID.substring(7).toLowerCase() ===
          peerAddress.toLowerCase()
      ) {
        chatExists = true;

        socket.current.emit("chat_exists_w_peer", peerAddress);
        break;
      }
    }
    if (!chatExists) {
      const aliceChatRequsts = await userAlice.current.chat.list("REQUESTS");
      for (const chat of aliceChatRequsts) {
        if (chat.did.substring(7).toLowerCase() === peerAddress.toLowerCase()) {
          chatExists = true;
          await userAlice.current.chat.accept(peerAddress);
          socket.current.emit("intent_accepted", peerAddress);
          break;
        }
      }
    }
    if (!chatExists) {
      await userAlice.current.chat.send(peerAddress, {
        type: "Text",
        content: "Hi Peer, setting up a call! from bored-anons.xyz",
      });
      socket.current.emit("chat_message_sent", peerAddress);
    }
    dispatch({type: actionTypes.SET_PEER_WALLET_ADDRESS, payload: peerAddress});
  };
  useEffect(() => {
    socket.current = io.connect(process.env.REACT_APP_SERVER_URL);
  }, []);

  useEffect(() => {
    if (!signer) return;
    if (isPeerConnected) return;
    const initializeUserAlice = async () => {
      userAlice.current = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.PROD,
      });
    };
    initializeUserAlice();
  }, [signer, isPeerConnected]);

  useEffect(() => {
    setupSocketListeners();

    if (walletConnected && walletAddress) {
      socket.current.emit("connect_wallet", walletAddress);
    }
    if (!walletAddress) {
      socket.current.emit("wallet_disconnected");
    }
  }, [walletAddress, walletConnected]);

  return (
    <div>
      <div className="hero min-h-screen bg-base-200">
        {!isPeerConnected ? (
          <div>
            {peerMatched || incomingPeerRequest ? (
              <Loader
                text={"Found your match!!!"}
                text2={"Negotiating a connection"}
              />
            ) : (
              <div className="hero-content text-center">
                <div className="max-w-md">
                  <h1 className="text-5xl font-bold">Hello Anon!</h1>
                  <p className="py-6">
                    ik you're bored, fret not anon, time to make some random
                    video calls with strangersssss.
                  </p>
                  <div className="flex flex-row gap-4 justify-center">
                    <ConnectButton showBalance={false} />
                    {walletConnected && !isPeerConnected && (
                      <button
                        className="btn btn-primary"
                        onClick={connectToPeer}
                      >
                        Connect to a Peer
                      </button>
                    )}
                  </div>
                  <div className="my-[20px]">
                    <input
                      type="checkbox"
                      className="toggle toggle-success"
                      checked={userActive}
                      onClick={() => {
                        dispatch({
                          type: actionTypes.SET_USER_ACTIVE,
                          payload: !userActive,
                        });
                        socket.current.emit("user_status_toggle", !userActive);
                      }}
                    />
                    {userActive ? (
                      <p>Active, Connects automatically to an incoming call</p>
                    ) : (
                      <p>Inactive, Does not connect to an incoming call</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Video
            peerAddress={peerWalletAddress}
            userAlice={userAlice.current}
            initiator={videoCallInitiator}
            onEndCall={() => {
              socket.current.emit("endPeerConnection");
              dispatch({
                type: actionTypes.SET_IS_PEER_CONNECTED,
                payload: false,
              });
              window.location.reload();
            }}
          />
        )}
      </div>

      {/* Render the modal when the peer is disconnected */}
      {showPeerDisconnectedModal && (
        <Modal
          text={"Peer Disconnected!"}
          onClose={() => {
            dispatch({
              type: actionTypes.SET_SHOW_PEER_DISCONNECTED_MODAL,
              payload: false,
            });
          }}
        />
      )}
      {/* Render the modal when no active peers are found */}
      {showNoActivePeersModal && (
        <Modal
          text={"No Active peers found!"}
          onClose={() => {
            dispatch({
              type: actionTypes.SET_SHOW_NO_ACTIVE_PEERS_MODAL,
              payload: false,
            });
          }}
        />
      )}
    </div>
  );
}

export default App;
