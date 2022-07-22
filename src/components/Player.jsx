import { useState, useEffect } from 'react';
import './Player.css';

import SpotifyPlayer from 'react-spotify-web-playback';

const Player = ({ accessToken, trackUri }) => {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    setPlay(true);
  }, [trackUri]);

  if (!accessToken) return null;
  return (
    <SpotifyPlayer
      token={accessToken}
      callback={(state) => !state.isPlaying && setPlay(false)}
      play={play}
      uris={trackUri ? trackUri : []}
      className='spotify-player'
      styles={{
        activeColor: '#1db954',
        bgColor: '#000',
        color: '#fff',
        loaderColor: '#fff',
        sliderColor: '#fff',
        trackArtistColor: '#ccc',
        trackNameColor: '#fff',
        sliderHandleColor: '#1db954',
      }}
    />
  );
};

export default Player;
