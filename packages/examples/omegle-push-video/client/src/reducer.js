// Action types
const actionTypes = {
  SET_IS_PEER_CONNECTED: "SET_IS_PEER_CONNECTED",
  SET_PEER_WALLET_ADDRESS: "SET_PEER_WALLET_ADDRESS",
  SET_SHOW_PEER_DISCONNECTED_MODAL: "SET_SHOW_PEER_DISCONNECTED_MODAL",
  SET_SHOW_NO_ACTIVE_PEERS_MODAL: "SET_SHOW_NO_ACTIVE_PEERS_MODAL",
  SET_PEER_MATCHED: "SET_PEER_MATCHED",
  SET_VIDEO_CALL_INITIATOR: "SET_VIDEO_CALL_INITIATOR",
  SET_USER_ACTIVE: "SET_USER_ACTIVE",
  SET_INCOMING_PEER_REQUEST: "SET_INCOMING_PEER_REQUEST",
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_IS_PEER_CONNECTED:
      return {...state, isPeerConnected: action.payload};
    case actionTypes.SET_PEER_WALLET_ADDRESS:
      return {...state, peerWalletAddress: action.payload};
    case actionTypes.SET_SHOW_PEER_DISCONNECTED_MODAL:
      return {...state, showPeerDisconnectedModal: action.payload};
    case actionTypes.SET_SHOW_NO_ACTIVE_PEERS_MODAL:
      return {...state, showNoActivePeersModal: action.payload};
    case actionTypes.SET_PEER_MATCHED:
      return {...state, peerMatched: action.payload};
    case actionTypes.SET_VIDEO_CALL_INITIATOR:
      return {...state, videoCallInitiator: action.payload};
    case actionTypes.SET_USER_ACTIVE:
      return {...state, userActive: action.payload};
    case actionTypes.SET_INCOMING_PEER_REQUEST:
      return {...state, incomingPeerRequest: action.payload};
    default:
      return state;
  }
};

export {actionTypes, appReducer};
