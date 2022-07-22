import React from 'react';
import { useContext } from 'react';
import Navigation from '../components/Navigation';
import Player from '../components/Player';
import { TrackContext } from '../contexts/TrackContext';
import { accessToken } from '../lib/spotify';
import './Layout.css';

function Layout(props) {
  const { children } = props;

  const { playingTrack } = useContext(TrackContext);
  return (
    <>
      <Navigation />
      <main> {children} </main>
      <Player accessToken={accessToken} trackUri={playingTrack} />
    </>
  );
}
export default Layout;
