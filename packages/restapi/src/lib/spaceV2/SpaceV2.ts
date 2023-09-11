import Constants, { ENV } from "../constants";
import { VIDEO_CALL_TYPE } from "../payloads/constants";
import { SignerType, VideoCallData, VideoCallStatus } from "../types";

export const initVideoCallData: VideoCallData = {
    meta: {
        chatId: '',
        initiator: {
            address: '',
            signal: null,
        },
        broadcast: {
            livepeerInfo: null,
            hostAddress: '',
            coHostAddress: '',
        },
    },
    local: {
        stream: null,
        audio: null,
        video: null,
        address: '',
    },
    incoming: [
        {
            stream: null,
            audio: null,
            video: null,
            address: '',
            status: VideoCallStatus.UNINITIALIZED,
            retryCount: 0,
        },
    ],
};

export class SpaceV2 {
    // user, call related info
    protected signer: SignerType;
    protected chainId: number;
    protected pgpPrivateKey: string;
    protected env: ENV;
    protected callType: VIDEO_CALL_TYPE;

    private peerConnections: Map<string, RTCPeerConnection> = new Map();

    protected data!: VideoCallData;
    setData: (fn: (data: VideoCallData) => VideoCallData) => void;

    constructor({
        signer,
        chainId,
        pgpPrivateKey,
        env = Constants.ENV.PROD,
        callType = VIDEO_CALL_TYPE.PUSH_VIDEO,
        setData,
    }: {
        signer: SignerType;
        chainId: number;
        pgpPrivateKey: string;
        env?: ENV;
        callType?: VIDEO_CALL_TYPE;
        setData: (fn: (data: VideoCallData) => VideoCallData) => void;
    }) {
        this.signer = signer;
        this.chainId = chainId;
        this.pgpPrivateKey = pgpPrivateKey;
        this.env = env;
        this.callType = callType;

        setData(() => initVideoCallData);

        // set the state updating function
        this.setData = function (fn) {
            // update the react state
            setData(fn);

            // update the class variable
            this.data = fn(this.data);
        };
    }

    // Add a connected peer to the space
    addPeer(peerId: string, peerConnection: RTCPeerConnection) {
        if (!this.peerConnections.has(peerId)) {
            this.peerConnections.set(peerId, peerConnection);
        } else {
            console.error(`Peer with ID ${peerId} already exists.`);
        }
    }

    // Remove a connected peer from the space
    removePeer(peerId: string) {
        if (this.peerConnections.has(peerId)) {
            this.peerConnections.delete(peerId);
        } else {
            console.error(`Peer with ID ${peerId} does not exist.`);
        }
    }

    // Get a connected peer's peer connection by their ID
    getPeerConnection(peerId: string): RTCPeerConnection | undefined {
        return this.peerConnections.get(peerId);
    }

    // Get the list of all connected peer IDs
    getConnectedPeerIds(): string[] {
        return Array.from(this.peerConnections.keys());
    }

    async connect(options: any) {
        /**
         * will contain logic to handle all connections
         */
    }

    async disconnect(options: any) {
        /**
         * will contain logic to handle all disconnections and terminations
         */
    }

    async request(options: any) {
        /**
         * will contain logic to handle requests made to join the space, being promoted to speaker, etc.
         */
    }

    async join(options: any) {
        /**
         * will contain logic to handle joining of speakers and listeners based on role
         */
    }

    async invite(options: any) {
        /**
         * will contain logic to handle invites made by host to listener
         */
    }
}
