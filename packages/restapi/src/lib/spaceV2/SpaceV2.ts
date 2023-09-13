import { produce } from "immer";

import { join } from "./join";
import { ISpaceInviteInputOptions, inviteToJoin } from "./inviteToJoin";

import Constants, { ENV } from "../constants";
import { EnvOptionsType, SignerType, SpaceDTO, SpaceV2Data, VideoCallStatus } from "../types";
import { pCAIP10ToWallet } from "../helpers";

export const initSpaceInfo: SpaceDTO = {
    members: [],
    pendingMembers: [],
    contractAddressERC20: null,
    numberOfERC20: -1,
    contractAddressNFT: null,
    numberOfNFTTokens: -1,
    verificationProof: '',
    spaceImage: null,
    spaceName: '',
    isPublic: false,
    spaceDescription: '',
    spaceCreator: '',
    spaceId: '',
    scheduleAt: null,
    scheduleEnd: null,
    status: null,
    inviteeDetails: {}
};

export const initSpaceV2Data: SpaceV2Data = {
    spaceInfo: initSpaceInfo,
    meta: {
        initiator: {
            address: '',
            signal: null,
        },
    },
    local: {
        stream: null,
        audio: null,
        video: null,
        address: '',
    },
    incomingPeerStreams: [
        {
            stream: null,
            audio: null,
            video: null,
            address: '',
            status: VideoCallStatus.UNINITIALIZED,
            retryCount: 0,
        },
    ],
    pendingPeerStreams: [
        {
            stream: null,
            audio: null,
            video: null,
            address: '',
            status: VideoCallStatus.UNINITIALIZED,
            retryCount: 0,
        },
    ]
};

export interface SpaceV2ConstructorType extends EnvOptionsType {
    signer: SignerType;
    pgpPrivateKey: string;
    chainId: number;
    address: string;
    setSpaceV2Data: (fn: (data: SpaceV2Data) => SpaceV2Data) => void;
}

export class SpaceV2 {
    // user, call related info
    protected signer: SignerType;
    protected chainId: number;
    protected pgpPrivateKey: string;
    protected env: ENV;

    private peerConnections: Map<string, RTCPeerConnection | undefined> = new Map();

    protected data!: SpaceV2Data;

    setSpaceV2Data: (fn: (data: SpaceV2Data) => SpaceV2Data) => void;

    constructor(options: SpaceV2ConstructorType) {
        const {
            signer,
            pgpPrivateKey,
            address,
            chainId,
            env = Constants.ENV.PROD,
            setSpaceV2Data, // to update the 'spaceData' state maintained by the developer
        } = options || {};

        this.signer = signer;
        this.chainId = chainId;
        this.pgpPrivateKey = pgpPrivateKey;
        this.env = env;

        setSpaceV2Data(() => initSpaceV2Data);

        // set the state updating function
        this.setSpaceV2Data = function (fn) {
            // update the react state
            setSpaceV2Data(fn);

            // update the class variable
            this.data = fn(this.data);
        };


        // initializing state
        // set the local address inside video call 'data'
        this.setSpaceV2Data((oldSpaceV2Data) => {
            return produce(oldSpaceV2Data, (draft) => {
                draft.local.address = pCAIP10ToWallet(address);
            });
        });

        // init the state maintained by the developer
        setSpaceV2Data(() => initSpaceV2Data);

        // init the spaceSpecificData class variable
        this.data = initSpaceV2Data;
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

    // Set a connected peer's peer connection by their ID
    setPeerConnection(peerId: string, peerConnection: RTCPeerConnection | undefined) {
        this.peerConnections.set(peerId, peerConnection);
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

    async invite(options: ISpaceInviteInputOptions) {
        await inviteToJoin.call(this, options); // Call the function with the current "this"
        /**
         * will contain logic to handle invites made by host to listener
         */
    }

    public join = join;
}
