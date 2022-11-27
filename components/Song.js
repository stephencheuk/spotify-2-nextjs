import React from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import millisToMinutesAndSeconds from "../lib/time";

function Song({ order, track }) {
  const spotifyApi = useSpotify();

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);

    spotifyApi.play({ uris: [track.track.uri] }).then(
      function () {
        console.log("Playback started");
      },
      function (err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
        console.log("Something went wrong!", err);
        if (
          err?.body?.error?.status === 403 &&
          err?.body?.error?.reason === "PREMIUM_REQUIRED"
        ) {
          // if (track.track.preview_url) {
          //   alert("You just only play preview song without PREMIUM account");
          //   spotifyApi.play({ uris: [track.track.preview_url] }).then(
          //     function () {
          //       console.log("Playback started");
          //     },
          //     function (err) {
          //       alert("Preview song does not permit");
          //     }
          //   );
          // } else {
          alert("You need PREMIUM account to permit this request");
          // }
        }
      }
    );
  };

  return (
    <div className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer">
      <div className="flex items-center space-x-4" onClick={playSong}>
        <p>{order + 1}</p>
        <img
          className="h-10 w-10"
          src={track?.track?.album.images?.[0]?.url}
          alt=""
        />
        <div>
          <p className="w-36 lg:w-64 text-white truncate">
            {track?.track?.name}
          </p>
          <p className="w-40">{track?.track?.artists?.[0]?.name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-40 hidden md:inline">{track?.track?.album?.name}</p>
        <p>{millisToMinutesAndSeconds(track?.track?.["duration_ms"])}</p>
      </div>
    </div>
  );
}

export default Song;
