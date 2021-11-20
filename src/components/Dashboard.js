import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Container } from "react-bootstrap";
import spotifyWebApi from "spotify-web-api-node";
import Player from "./Player";
import TrackSearchResult from "./TrackSearchResult";
import axios from "axios";
import SearchBar from "./SearchBar";
import "../styles/Dashboard.css";
import Home from "./Home";

import playerStyles from "../styles/Player.less";

const spotifyApi = new spotifyWebApi({
  clientId: "08ac760aa41542e0ab092d3e24c13664",
});

export default function Dashboard({ code }) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");
  const [shouldSearch, setShouldSearch] = useState(false);
  const [shouldShowLibrary, setShouldShowLibrary] = useState(false);
  const [shouldShowHome, setShouldShowHome] = useState(true);

  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
  }

  const accessToken = useAuth(code);

  useEffect(() => {
    if (!playingTrack) return;

    axios
      .get("http://localhost:3001/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then((res) => {
        setLyrics(res.data.lyrics);
      });
  }, [playingTrack]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });

    return () => (cancel = true);
  }, [search, accessToken]);

  useEffect(() => {
    const PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/me/playlists"

    if (!shouldShowLibrary && !shouldSearch) {
      setShouldShowHome(true);
    }

    axios.get(
      PLAYLIST_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }
     
    ).then(data => {
      console.log(data)
    }).catch(err => {
      
      console.log(err)
    })
  });

  return (
    <Container
      className="d-flex flex-column py-2"
      style={{
        height: "100vh",
      }}
    >
      <h1 className="my-4">Musing Music</h1>

      {shouldShowHome && (
        <>
          <Home />
        </>
      )}

      {shouldSearch && (
        <>
          <SearchBar search={search} setSearch={setSearch} />

          <div
            className="flex-grow-1 my-2"
            style={{
              overflowY: "auto",
            }}
          >
            {" "}
            {searchResults.map((track) => (
              <TrackSearchResult
                track={track}
                key={track.uri}
                chooseTrack={chooseTrack}
              />
            ))}
            {searchResults.length === 0 && (
              <div className="text-center" style={{ whiteSpace: "pre" }}>
                {lyrics && playingTrack
                  ? lyrics
                  : !playingTrack
                  ? ""
                  : playingTrack && !lyrics
                  ? "No lyrics found"
                  : ""}
              </div>
            )}
          </div>
        </>
      )}

      <div id="footer">
        <Player
          style={playerStyles}
          accessToken={accessToken}
          trackUri={playingTrack?.uri}
        />
      </div>
    </Container>
  );
}
