import { useEffect } from 'react';
import { BsMusicNoteBeamed } from 'react-icons/bs';

const DisplayTrack = ({
  currentTrack,
  audioRef,
  setDuration,
  progressBarRef,
  handleNext,
}) => {
  const onLoadedMetadata = () => {
    const seconds = audioRef.current.duration;
    setDuration(seconds);
    progressBarRef.current.max = seconds;
  };




  return (
    <div>
      <audio
        src={currentTrack.music}
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleNext}
      />
      <div className="text-center mt-4">
        <div className="truncate text-gray-300">
          <p className="truncate text-white font-bold text-lg">{currentTrack.title}</p>
          <p>{currentTrack.artist}</p>
        </div>
      </div>
    </div>
  );
};
export default DisplayTrack;
