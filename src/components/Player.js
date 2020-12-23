import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faAngleRight,
  faAngleLeft,
  faPause,
  faVolumeUp,
  faVolumeDown,
  faVolumeOff,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";
const Player = ({
  audioRef,
  isPlaying,
  setIsPlaying,
  songInfo,
  setSongInfo,
  songs,
  setCurrentSong,
  currentSong,
  setSongs,
}) => {
  const [icon, setIcon] = useState({
    volumeIcon: faVolumeUp,
  });
  const activeLibraryHandler = (nextPrev) => {
    const newSongs = songs.map((song) => {
      if (song.id === nextPrev.id) {
        return {
          ...song,
          active: true,
        };
      } else {
        return {
          ...song,
          active: false,
        };
      }
    });
    setSongs(newSongs);
  };
  //Event Handlers
  const playSongHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };
  const getTime = (time) => {
    return Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2);
  };
  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    setSongInfo({ ...songInfo, currentTime: e.target.value });
  };
  const skibTrackHandler = async (direction) => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    if (direction === "skip-forward") {
      await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
      activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
    }
    if (direction === "skip-back") {
      if ((currentIndex - 1) % songs.length === -1) {
        await setCurrentSong(songs[songs.length - 1]);
        activeLibraryHandler(songs[songs.length - 1]);
        if (isPlaying) audioRef.current.play();
        return;
      }
      await setCurrentSong(songs[(currentIndex - 1) % songs.length]);
      activeLibraryHandler(songs[(currentIndex - 1) % songs.length]);
    }
    if (isPlaying) audioRef.current.play();
  };
  const scale = (num, in_min, in_max, out_min, out_max) => {
    return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  };
  const dragVolumeHandler = (e) => {
    audioRef.current.volume = scale(e.target.value, 0, 100, 0, 1);
    setSongInfo({ ...songInfo, volume: scale(e.target.value, 0, 100, 0, 1) });
    const value = e.target.value;
    if (value >= 70) {
      setIcon({
        volumeIcon: faVolumeUp,
      });
    } else if (value >= 40) {
      setIcon({
        volumeIcon: faVolumeDown,
      });
    } else if (value > 1) {
      setIcon({
        volumeIcon: faVolumeOff,
      });
    } else {
      setIcon({
        volumeIcon: faVolumeMute,
      });
    }
  };

  //Add the styles
  const trackAnim = {
    transform: `translateX(${songInfo.animationPercentage}%)`,
  };
  return (
    <div className="player">
      <div className="inputs">
        <div className="time-control">
          <p>{getTime(songInfo.currentTime)}</p>
          <div
            style={{
              background: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`,
            }}
            className="track"
          >
            <input
              min="0"
              max={songInfo.duration || 0}
              value={songInfo.currentTime}
              onChange={dragHandler}
              type="range"
              className="song-input"
            />
            <div style={trackAnim} className="animate-track"></div>
          </div>
          <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
        </div>
        <div className="volume-control">
          <input
            min="0"
            max="100"
            defaultValue="100"
            onChange={dragVolumeHandler}
            type="range"
            className="volume-input"
          />
          <FontAwesomeIcon className="volume-icon" size="1x" icon={icon.volumeIcon} />
        </div>
      </div>
      <div className="play-control">
        <FontAwesomeIcon
          onClick={() => skibTrackHandler("skip-back")}
          className="skip-back"
          size="2x"
          icon={faAngleLeft}
        />
        <FontAwesomeIcon
          onClick={playSongHandler}
          className="play"
          size="2x"
          icon={isPlaying ? faPause : faPlay}
        />
        <FontAwesomeIcon
          onClick={() => skibTrackHandler("skip-forward")}
          className="skip-forward"
          size="2x"
          icon={faAngleRight}
        />
      </div>
    </div>
  );
};

export default Player;
