import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
  // "playlist-read-private",
  // "playlist-read-collaborative",
  // "playlist-modify-private",
  // "playlist-modify-public",
  // "playlist-read-public",

  // "user-read-email",

  // "streaming",
  // "user-read-private",
  // "user-library-read",

  // "user-top-read",
  // "user-library-modify",
  // "user-read-email",
  // "user-read-playback-state",
  // "user-read-playback-position",
  // "user-modify-playback-state",
  // "user-read-currently-playing",
  // "user-read-recently-played",
  // "user-follow-read",
  // "user-follow-modify",

  // "ugc-image-upload",

  // Images
  "ugc-image-upload",
  // Spotify Connect
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  // Playback
  "app-remote-control",
  "streaming",
  // Playlists
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
  // Follow
  "user-follow-modify",
  "user-follow-read",
  // Listening History
  "user-read-playback-position",
  "user-top-read",
  "user-read-recently-played",
  // Library
  "user-library-modify",
  "user-library-read",
  // Users
  "user-read-email",
  "user-read-private",
];

const params = {
  scope: scopes.join(","),
};

// https://accounts.spotify.com/authorize?params=user-read-email,playlist...

// const queryParamString = new URLSearchParams(params).toString();

// const LOGIN_URL = `https://accounts.spotify.com/authorize?params=${queryParamString}`;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

const LOGIN_URL = spotifyApi.createAuthorizeURL(scopes);

export default spotifyApi;

export { LOGIN_URL };
