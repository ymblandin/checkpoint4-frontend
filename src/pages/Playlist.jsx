import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPlaylist } from '../lib/spotify';
import Layout from '../layouts/Layout';
import { millisToMinutesAndSeconds } from '../lib/utils';
import './Playlist.css';
import { useContext } from 'react';
import { TrackContext } from '../contexts/TrackContext';

function Playlist() {
  const { playlistId } = useParams();

  const [playlistData, setPlaylistData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getPlaylist(playlistId);
        setPlaylistData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [playlistId]);

  const { setPlayingTrack } = useContext(TrackContext);

  return (
    <Layout>
      <div className='Playlist'>
        {playlistData && (
          <>
            <div className='playlist-img-container'>
              <img
                src={playlistData.images[0].url}
                alt='Artist avatar'
                className='playlist-img'
              />
            </div>
            <h1>{playlistData.name}</h1>
          </>
        )}

        {playlistData && (
          <>
            {playlistData.tracks.items.map((item) => {
              return (
                <div
                  key={item.track.id}
                  className='track-card'
                  onClick={() => setPlayingTrack(item.track.uri)}
                >
                  <div className='track-title'>
                    <h3>{item.track.name}</h3>
                    <p>{item.track.artists[0].name}</p>
                  </div>
                  <p>{millisToMinutesAndSeconds(item.track.duration_ms)}</p>
                </div>
              );
            })}
          </>
        )}
      </div>
    </Layout>
  );
}

export default Playlist;
