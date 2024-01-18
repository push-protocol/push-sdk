import VideoPlayer from "./VideoPlayer";

import {
  IoMicOffOutline,
  IoMicSharp,
  IoVideocamOffSharp,
  IoVideocamOutline,
} from "react-icons/io5";
import {ImPhoneHangUp} from "react-icons/im";

export default function VideoFrame({
  data,
  onToggleMic,
  onToggleCam,
  onEndCall,
}) {
  return (
    <div>
      <div className="w-[90%] m-auto flex flex-row justify-around gap-2">
        <div>
          <VideoPlayer
            whoIs={"You"}
            stream={data.local.stream}
            isMuted={true}
          />
        </div>

        <div>
          {data?.incoming[0] ? (
            <VideoPlayer
              whoIs={data?.incoming[0]?.address}
              styles="overflow-hidden w-[95%] m-auto"
              stream={data.incoming[0].stream}
              isMuted={false}
            />
          ) : (
            <div className="min-h-[30vh] h-[30vh] sm:min-h-[40vh] md:min-h-[55vh] sm:h-[40%] bg-[white]"></div>
          )}
        </div>
      </div>
      <div className="flex gap-2 justify-center align-center md:mt-[30px] xl:mt-[20px] mt-[20px] ">
        <button
          className="btn btn-outline btn-info"
          disabled={!data.incoming[0]}
          onClick={onToggleMic}
        >
          {!data.local.audio ? (
            <IoMicOffOutline size={"20px"} />
          ) : (
            <IoMicSharp size={"20px"} />
          )}
        </button>
        <button
          className="btn btn-outline btn-info"
          disabled={!data.incoming[0]}
          onClick={onToggleCam}
        >
          {data.local.video ? (
            <IoVideocamOutline size={"20px"} />
          ) : (
            <IoVideocamOffSharp size={"20px"} />
          )}
        </button>

        <button
          className="btn btn-outline btn-error"
          onClick={onEndCall}
          disabled={!data?.incoming[0]?.address}
        >
          <ImPhoneHangUp size={"20px"} />
        </button>
      </div>
    </div>
  );
}
