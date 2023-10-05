import axios from "axios"

import { LIVEKIT_TOKEN_GENERATOR_SERVER_URL } from "../config";

export interface IPerformActionProps {
    canPublish: boolean;
    roomId: string | undefined;
    userId?: string;
}

export const performAction = async ({ roomId, userId, canPublish }: IPerformActionProps) => {
    const url = `${LIVEKIT_TOKEN_GENERATOR_SERVER_URL}/execute?roomName=${roomId}&identity=${userId}&canPublish=${canPublish}`;

    return await axios.get(url);
};