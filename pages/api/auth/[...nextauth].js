import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

async function refreshAccessToken(token) {
  try {
    // console.log("nextauth.js setAccessToken", token.accessToken);
    spotifyApi.setAccessToken(token.accessToken);
    // console.log("nextauth.js setRefreshToken", token.refreshToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    // console.log("nextauth.js refreshAccessToken");
    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

    // const { body: refreshedToken } = await spotifyApi.refreshAccessToken()
    // .then(
    //   function (data) {
    //     console.log('The access token has been refreshed!', data);
    //     if (data?.body?.access_token) {
    //       // Save the access token so that it's used in future calls
    //       spotifyApi.setAccessToken(data.body?.access_token);
    //     }
    //   },

    //   function (err) {
    //     console.log('Could not refresh access token', err);
    //   }

    // );

    // console.log("REFRESHED TOKEN IS", refreshedToken);

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now + refreshedToken.expires_in * 1000, // = 1 hour as 3600 return from spotify API
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
      // Replace if new one came back else fall back to old refresh token
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // initial sign-in
      if (account && user) {
        // console.log("callback", account, user);
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        console.log("nextauth.js: EXISTING ACCESS TOKEN IS VALID");
        return token;
      }

      console.log("nextauth.js: ACCESS TOKEN HAS EXPIRED, REFRESHING...");
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    },
  },
});
