import React, {useEffect, useRef, useState} from "react";
import io from "socket.io-client";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useAccount, useWalletClient} from "wagmi";

import Modal from "./components/Modal";
import {CONSTANTS, PushAPI, user} from "@pushprotocol/restapi";
import Video from "./video";
import Loader from "./components/Loader";

// Initializing the socket connection to the server

const socket = io.connect(process.env.REACT_APP_SERVER_URL);

// Main App component
function App() {
  // State variables
  const [isPeerConnected, setIsPeerConnected] = useState(false);
  const [peerWalletAddress, setPeerWalletAddress] = useState("");
  const [showPeerDisconnectedModal, setShowPeerDisconnectedModal] =
    useState(false);
  const [showNoActivePeersModal, setShowNoActivePeersModal] = useState(false);
  const [peerMatched, setPeerMatched] = useState(false);
  const [videoCallInitiator, setVideoCallInitiator] = useState("");
  const [userActive, setUserActive] = useState(true);
  const [incomingPeerRequest, setIncomingPeerRequest] = useState(false);
  const userAlice = useRef();
  const {data: signer} = useWalletClient();
  const {address: walletAddress, isConnected: walletConnected} = useAccount();

  const connectToPeer = () => {
    socket.emit("connect_to_peer", walletAddress);
  };
  useEffect(() => {
    if (!signer) return;
    if (isPeerConnected) return;
    const initializeUserAlice = async () => {
      userAlice.current = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.DEV,
      });
    };
    initializeUserAlice();
  }, [signer, isPeerConnected]);
  useEffect(() => {
    socket.on("peer_matched", (peerAddress) => {
      setPeerMatched(true);
      checkIfChatExists(peerAddress);
      setVideoCallInitiator(walletAddress);
    });
    socket.on("incoming_peer_request", () => {
      console.log("Incoming peer request");
      setIncomingPeerRequest(true);
    });
    socket.on("intent_accepted_by_peer", async (peerAddress) => {
      setIsPeerConnected(true);
    });
    socket.on("chat_exists_bw_users", async (peerAddress) => {
      setIsPeerConnected(true);
    });
    socket.on("no_active_peers_found", () => {
      setShowNoActivePeersModal(true);
    });
    socket.on("peer_disconnected", () => {
      setIsPeerConnected(false);
      setIncomingPeerRequest(false);
      setPeerWalletAddress("");
      setShowPeerDisconnectedModal(true);
    });

    socket.on("chat_message_request", async (peerAddress) => {
      await userAlice.current.chat.accept(peerAddress);
      socket.emit("intent_accepted", peerAddress);
    });

    socket.on("peer_disconnected_call", async (peerAddress) => {
      setIsPeerConnected(false);
      setIncomingPeerRequest(false);
      window.location.reload();
    });

    // Connect wallet to the server if connected
    if (walletConnected && walletAddress) {
      socket.emit("connect_wallet", walletAddress);
    }
    if (!walletAddress) {
      socket.emit("wallet_disconnected");
    }
  }, [walletAddress, walletConnected]);
  const checkIfChatExists = async (peerAddress) => {
    const aliceChats = await userAlice.current.chat.list("CHATS");

    let chatExists = false;
    for (const chat of aliceChats) {
      if (chat.did.substring(7).toLowerCase() === peerAddress.toLowerCase()) {
        chatExists = true;
        socket.emit("chat_exists_w_peer", peerAddress);
        break;
      }
    }
    if (!chatExists) {
      const aliceChatRequsts = await userAlice.current.chat.list("REQUESTS");
      for (const chat of aliceChatRequsts) {
        if (chat.did.substring(7).toLowerCase() === peerAddress.toLowerCase()) {
          chatExists = true;
          await userAlice.current.chat.accept(peerAddress);
          socket.emit("intent_accepted", peerAddress);
          break;
        }
      }
    }
    if (!chatExists) {
      await userAlice.current.chat.send(peerAddress, {
        type: "Text",
        content: "Hi Peer, setting up a call!",
      });

      socket.emit("chat_message_sent", peerAddress);
    }
    setPeerWalletAddress(peerAddress);
  };

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
                        setUserActive(!userActive);
                        socket.emit("user_status_toggle", !userActive);
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
              socket.emit("endPeerConnection");
              setIsPeerConnected(false);
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
            setShowPeerDisconnectedModal(false);
          }}
        />
      )}
      {/* Render the modal when no active peers are found */}
      {showNoActivePeersModal && (
        <Modal
          text={"No Active peers found!"}
          onClose={() => {
            setShowNoActivePeersModal(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
