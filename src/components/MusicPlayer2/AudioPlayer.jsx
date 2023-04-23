import { useEffect, useRef, useState, useContext } from 'react';
import { SongContext } from '../context/SongContext';
// import components
import DisplayTrack from './DisplayTrack';
import Controls from './Controls';
import ProgressBar from './ProgressBar';

const AudioPlayer = ({ songsData, isFetchingData, user }) => {


  // states
  // const [trackIndex, setTrackIndex] = useState(0);
  const { trackIndex, setTrackIndex } = useContext(SongContext);
  const [currentTrack, setCurrentTrack] = useState(
    songsData[trackIndex]
  );
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // reference
  const audioRef = useRef();
  const progressBarRef = useRef();

  const handleNext = () => {
    if (trackIndex >= songsData.length - 1) {
      setTrackIndex(0);
      setCurrentTrack(songsData[0]);
    } else {
      setTrackIndex((prev) => prev + 1);
      setCurrentTrack(songsData[trackIndex + 1]);
    }
  };

  useEffect(() => {
    setCurrentTrack(songsData[trackIndex]);
  }, [trackIndex]);

  return (
    <>
      <div className="relative sm:px-12 px-8 w-full flex items-center justify-between">
        <div className="flex-1 flex flex-col items-center justify-center self-center">
          <DisplayTrack
            {...{
              currentTrack,
              audioRef,
              setDuration,
              progressBarRef,
              handleNext,
            }}
          />
          <Controls
            {...{
              audioRef,
              progressBarRef,
              duration,
              setTimeProgress,
              songsData,
              trackIndex,
              setTrackIndex,
              setCurrentTrack,
              handleNext,
              user
            }}
          />
          <ProgressBar
            {...{ progressBarRef, audioRef, timeProgress, duration }}
          />
        </div>
      </div>
    </>
  );
};
export default AudioPlayer;
