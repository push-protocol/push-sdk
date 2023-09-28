import { useIsSpeaking, useLocalParticipant, TrackMutedIndicator } from "@livekit/components-react";
import { Track } from "livekit-client";

export default function Microphone() {
    const { localParticipant } = useLocalParticipant();
    const isSpeaking = useIsSpeaking(localParticipant);

    return (
        <div>{isSpeaking ? 'Speaking' : 'Silent'}</div>
    )
}
