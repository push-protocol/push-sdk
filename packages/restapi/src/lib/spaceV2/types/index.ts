import { SPACE_REQUEST_TYPE } from "../../payloads";

export type SpaceInviteInputOptions = {
    senderAddress: string;
    recipientAddress: string;
    spaceId: string;
    onReceiveMessage?: (message: string) => void;
    retry?: boolean;
    details?: {
        type: SPACE_REQUEST_TYPE;
        data: Record<string, unknown>;
    };
};