import {
  HomeIcon,
  MagnifyingGlassIcon as SearchIcon,
  BuildingLibraryIcon as LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  // console.log(`playlistId`, playlistId);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getUserPlaylists()
        .then((data) => {
          setPlaylists(data.body.items);
        });
    }
  }, [session, spotifyApi]);

  // console.log(playlists)

  return (
    <div className="text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen sm:max-w-[12rem] lg:max-w-[15rme] hidden md:inline-flex pb-36">
      <div className="space-y-4">
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        {/* <button className="flex items-center space-x-2 hover:text-white">
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <LibraryIcon className="h-5 w-5" />
          <p>Your Libaray</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-500" />
        <button className="flex items-center space-x-2 hover:text-white">
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5" />
          <p>Liked Song</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="h-5 w-5" />
          <p>Your episodes</p>
        </button> */}
        <hr className="border-t-[0.1px] border-gray-500" />

        {
          playlists.map((playlist) => (
            <div key={playlist.id} className="flex items-center space-x-2" onClick={() => setPlaylistId(playlist.id)}>
              <img className="w-5 h-5 rounded" src={playlist.images[0].url} />
              <p className="cursor-pointer hover:text-white">{playlist.name}</p>
            </div>
          )
          )
        }

      </div>
    </div>
  );
}

export default Sidebar;
