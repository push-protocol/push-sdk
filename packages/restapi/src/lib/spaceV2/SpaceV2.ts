import Constants, { ENV } from "../constants";
import { VIDEO_CALL_TYPE } from "../payloads/constants";
import { SignerType } from "../types";

export class SpaceV2 {
    // user, call related info
    protected signer: SignerType;
    protected chainId: number;
    protected pgpPrivateKey: string;
    protected env: ENV;
    protected callType: VIDEO_CALL_TYPE;

    // protected data: VideoCallData;

    constructor({
        signer,
        chainId,
        pgpPrivateKey,
        env = Constants.ENV.PROD,
        callType = VIDEO_CALL_TYPE.PUSH_VIDEO,
    }: {
        signer: SignerType;
        chainId: number;
        pgpPrivateKey: string;
        env?: ENV;
        callType?: VIDEO_CALL_TYPE;
    }) {
        this.signer = signer;
        this.chainId = chainId;
        this.pgpPrivateKey = pgpPrivateKey;
        this.env = env;
        this.callType = callType;
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