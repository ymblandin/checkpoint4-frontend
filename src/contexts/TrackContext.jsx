import { useState } from 'react';
import { createContext } from 'react';

export const TrackContext = createContext(null);

function TrackContextProvider(props) {
  const { children } = props;

  const [playingTrack, setPlayingTrack] = useState(null);

  return (
    <TrackContext.Provider
      value={{ playingTrack: playingTrack, setPlayingTrack: setPlayingTrack }}
    >
      {children}
    </TrackContext.Provider>
  );
}

export default TrackContextProvider;
