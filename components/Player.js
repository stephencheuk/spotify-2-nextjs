import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import {
  ArrowsRightLeftIcon as SwitchHorizontalIcon,
  ArrowPathIcon as ReplyIcon,
  SpeakerXMarkIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import {
  BackwardIcon as RewindIcon,
  PlayCircleIcon as PlayIcon,
  PauseIcon,
  ForwardIcon,
} from "@heroicons/react/24/solid";
import { debounce } from "lodash";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    console.log("player fetchCurrentSong songInfo", songInfo);
    if (!songInfo?.name) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now playing:", data.body?.item);
        setCurrentTrackId(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    console.log("handlePlayPause");
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      console.log("handlePlayPause is_playing", data.body?.is_playing);
      if (data.body?.is_playing) {
        spotifyApi.pause().then(
          (d) => {
            // console.log(d);
          },
          (e) => {
            alert(e.body?.error?.message);
          }
        );
        setIsPlaying(false);
      } else {
        spotifyApi.play().then(
          () => {},
          (e) => {
            alert(e.body?.error?.message);
          }
        );
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    console.log("player", currentTrackId, spotifyApi, session);
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      console.log("player fetchCurrentSong");
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceAdjustVolume(volume);
    }
  }, [volume]);

  const debounceAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {
        console.log(err);
      });
    }, 500),
    []
  );

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      <div className="flex items-center space-x-4">
        {songInfo?.album?.images?.[0]?.url && (
          <img
            className="hidden md:inline h-10 w-10"
            src={songInfo?.album?.images?.[0]?.url}
            alt=""
          />
        )}
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      {/* Center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          onClick={() => {
            // The API is not working as expected
            // spotifyApi.skipToPrevious();
          }}
          className="button"
        />
        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
        )}
        <ForwardIcon className="button" />
        <ReplyIcon className="button" />
      </div>
      {/* Right */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <SpeakerXMarkIcon
          onClick={() =>
            volume > 0 && setVolume(volume - 10 < 0 ? 0 : volume - 10)
          }
          className="button"
        />
        <input
          className="w-14 md:w-28 bg-blue-500"
          type="range"
          value={volume}
          min={0}
          max={100}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <SpeakerWaveIcon
          onClick={() =>
            volume < 100 && setVolume(volume + 10 > 100 ? 100 : volume + 10)
          }
          className="button"
        />
      </div>
    </div>
  );
}

export default Player;
