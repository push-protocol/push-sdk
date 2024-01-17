import {useEffect, useRef} from "react";

export default function VideoPlayer({stream, isMuted, whoIs}) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  }, [videoRef, stream]);

  return (
    <div
      className={`relative min-h-[30vh] h-[30vh] sm:min-h-[40vh] md:min-h-[55vh] sm:h-[40%]`}
    >
      <p className="absolute bottom-[10px] left-[20px] p-4 badge ">{whoIs}</p>
      <video
        className="object-cover w-full h-full rounded-xl"
        ref={videoRef}
        muted={isMuted}
        autoPlay
      />
    </div>
  );
}
