import axios from "axios"
import { v4 as uuidv4 } from "uuid";

import { LIVEKIT_TOKEN_GENERATOR_SERVER_URL } from "../config";

export interface IGetLivekitRoomProps {
    userType: "sender" | "receiver";
    roomId: string;
}

export const getLivekitRoomToken = async ({ userType, roomId }: IGetLivekitRoomProps) => {
  console.log("🚀 ~ file: getToken.js:5 ~ getToken ~ roomId:", roomId)
  if (userType !== "sender" && userType !== "receiver") {
    throw new Error("Invalid userType. Use 'sender' or 'receiver'.");
  }

  // generate a unique uuid
  const identity = uuidv4();

  const url = `${LIVEKIT_TOKEN_GENERATOR_SERVER_URL}/token?userType=${userType}&userName=${identity}&roomId=${roomId}`;

  return await axios.get(url);
};