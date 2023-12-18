import React, {useEffect, useState} from "react";
import io from "socket.io-client";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useAccount} from "wagmi";
import {PushAPI} from "@pushprotocol/restapi";
import {ethers} from "ethers";
import {PushChat} from "./components/PushChat";
import ButtonStyled from "./components/Button";
import styled from "styled-components";

// Replace with the actual path to your Modal component
import Modal from "./components/Modal";

// Initializing the socket connection to the server
const socket = io.connect("http://localhost:3001");

// Main App component
function App() {
  // State variables
  const [isPeerConnected, setIsPeerConnected] = useState(false);
  const [peerWalletAddress, setPeerWalletAddress] = useState("");
  const [showPeerDisconnectedModal, setShowPeerDisconnectedModal] =
    useState(false);
  const [showNoActivePeersModal, setShowNoActivePeersModal] = useState(false);

  // Retrieving wallet information using Wagmi hook
  const {address: walletAddress, isConnected: walletConnected} = useAccount();

  // Function to connect to a peer
  const connectToPeer = () => {
    socket.emit("connect_to_peer", walletAddress);
  };

  // Initializing Ethereum provider and signer
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  // useEffect to handle socket events and lifecycle
  useEffect(() => {
    // Event listener for peer connection
    socket.on("peer_connected", (peerAddress) => {
      console.log(peerAddress);
      setIsPeerConnected(true);
      setPeerWalletAddress(peerAddress);
    });

    // Event listener for peer disconnection
    socket.on("peer_disconnected", () => {
      setIsPeerConnected(false);
      setPeerWalletAddress("");
      // Show the modal on peer disconnection
      setShowPeerDisconnectedModal(true);
    });
    // Event listener for no active peers found
    socket.on("no_active_peers_found", () => {
      // Show the modal for no active peers found
      setShowNoActivePeersModal(true);
    });

    // Connect wallet to the server if connected
    if (walletConnected !== undefined) {
      socket.emit("connect_wallet", walletAddress);
    }

    // Cleanup when the component unmounts
    return () => {
      socket.emit("disconnect_peer", walletAddress);
      socket.disconnect();
    };
  }, [walletAddress, walletConnected]);

  return (
    <PageContainer>
      <Header>
        <Title>Omegle but Push Chat</Title>
      </Header>
      <div>
        <HorizontalCenteredDiv>
          <ConnectButton />
          {/* Render "Connect to a Peer" button if wallet is connected and not connected to a peer */}
          {walletConnected && !isPeerConnected && (
            <ButtonStyled onClick={connectToPeer} text={`Connect to a Peer`} />
          )}
        </HorizontalCenteredDiv>

        {/* Render PushChat component if connected to a peer */}
        {isPeerConnected && (
          <PushChat chatId={peerWalletAddress} signer={signer} />
        )}

        {/* Render the modal when the peer is disconnected */}
        {showPeerDisconnectedModal && (
          <Modal
            onClose={() => {
              setShowPeerDisconnectedModal(false);
            }}
          >
            <p>Peer Disconnected!</p>
          </Modal>
        )}
        {/* Render the modal when no active peers are found */}
        {showNoActivePeersModal && (
          <Modal
            onClose={() => {
              setShowNoActivePeersModal(false);
            }}
          >
            <p>No Active peers found!</p>
          </Modal>
        )}
      </div>
    </PageContainer>
  );
}

// Styled component for horizontal centering
const HorizontalCenteredDiv = styled.div`
  display: flex;
  justify-content: center;
`;
const PageContainer = styled.div`
  margin: 0;
  padding: 0;
  font-family: "Arial", sans-serif;
  background-color: #f8f8f8; /* Light background color */
  color: #333; /* Text color for light theme */
`;

const Header = styled.header`
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 36px;
  color: #333; /* Text color for light theme */
`;

// Exporting the App component as the default export
export default App;
