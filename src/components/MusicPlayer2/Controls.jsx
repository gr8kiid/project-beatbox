import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../firebase-config'
import { PointsContext } from '../context/PointsContext';
import { SongContext } from '../context/SongContext';

import { FaPlay, FaPause, FaFastBackward, FaFastForward, FaStepBackward, FaStepForward, FaVolumeDown, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const Controls = ({
  audioRef,
  progressBarRef,
  duration,
  setTimeProgress,
  songsData,
  trackIndex,
  setTrackIndex,
  setCurrentTrack,
  handleNext,
  user,
}) => {
  // const [isPlaying, setIsPlaying] = useState(false);
  const { isPlaying, setIsPlaying } = useContext(SongContext);
  const [volume, setVolume] = useState(60);
  const [muteVolume, setMuteVolume] = useState(false);
  const [timer, setTimer] = useState(0);
  const { points, setPoints } = useContext(PointsContext);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const updatePointsFireStore = async (user, points) => {
    try {
      const userRef = doc(db, "listener", user.uid);
      await updateDoc(userRef, {
        points: points,
      });
    }
    catch (e) {
      alert("Error updating points: ", e);
    }
  }

  useEffect(() => {
    let isSeeking = false; // initialize isSeeking to false
    if (audioRef.current) {
      const updatePoints = () => {
        if (isSeeking || muteVolume) { // check if the user is seeking
          return;
        }
        const currentTime = audioRef.current.currentTime;
        const timer = Math.floor(currentTime / 6);
        setTimer(timer)
      };
      audioRef.current.addEventListener('timeupdate', updatePoints);
      audioRef.current.addEventListener('seeking', () => {
        isSeeking = true; // set isSeeking to true when the user is seeking
      });
      audioRef.current.addEventListener('seeked', () => {
        isSeeking = false; // set isSeeking back to false when the user is done seeking
      });
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', updatePoints);
          audioRef.current.removeEventListener('seeking', () => { });
          audioRef.current.removeEventListener('seeked', () => { });
        }
      };
    }
  }, [audioRef, muteVolume]);

  useEffect(() => {
    const delay = 5000; // debounce delay in milliseconds
    let timerId = null;

    if (timer > 0) {
      timerId = setTimeout(() => {
        setPoints(prev => prev + 1);
        updatePointsFireStore(user, points);
        // console.log("Congratulations! You have earned " + points + " points");
      }, delay);
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timer]);



  const playAnimationRef = useRef();

  const repeat = useCallback(() => {
    const currentTime = audioRef.current.currentTime;
    setTimeProgress(currentTime);
    progressBarRef.current.value = currentTime;
    progressBarRef.current.style.setProperty(
      '--range-progress',
      `${(progressBarRef.current.value / duration) * 100}%`
    );

    playAnimationRef.current = requestAnimationFrame(repeat);
  }, [audioRef, duration, progressBarRef, setTimeProgress]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    playAnimationRef.current = requestAnimationFrame(repeat);

  }, [isPlaying, audioRef, repeat]);

  const skipForward = () => {
    audioRef.current.currentTime += 15;
  };

  const skipBackward = () => {
    audioRef.current.currentTime -= 15;
  };

  const handlePrevious = () => {
    if (trackIndex === 0) {
      let lastTrackIndex = songsData.length - 1;
      setTrackIndex(lastTrackIndex);
      setCurrentTrack(songsData[lastTrackIndex]);
    } else {
      setTrackIndex((prev) => prev - 1);
      setCurrentTrack(songsData[trackIndex - 1]);
    }
  };

  useEffect(() => {
    if (audioRef) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = muteVolume;
    }
  }, [volume, audioRef, muteVolume]);

  return (
    <div className="flex items-center justify-between md:w-36 lg:w-52 2xl:w-80 my-2">
      <div className="flex items-center justify-between md:w-36 lg:w-52 2xl:w-80">
        <button onClick={handlePrevious} >
          <FaStepBackward />
        </button>
        <button onClick={skipBackward}>
          <FaFastBackward />
        </button>

        <button onClick={togglePlayPause}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={skipForward}>
          <FaFastForward />
        </button>
        <button onClick={handleNext}>
          <FaStepForward />
        </button>
      </div>
      <div className="volume">
        <button onClick={() => setMuteVolume((prev) => !prev)}>
          {muteVolume || volume < 5 ? (
            <FaVolumeMute />
          ) : volume < 40 ? (
            <FaVolumeDown />
          ) : (
            <FaVolumeUp />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          style={{
            background: `linear-gradient(to right, #f50 ${volume}%, #ccc ${volume}%)`,
          }}
        />
      </div>
    </div>
  );
};

export default Controls;
