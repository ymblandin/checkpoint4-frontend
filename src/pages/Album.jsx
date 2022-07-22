import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAlbum } from '../lib/spotify';
import Layout from '../layouts/Layout';
import './Album.css';
import { useContext } from 'react';
import { TrackContext } from '../contexts/TrackContext';
import { millisToMinutesAndSeconds } from '../lib/utils';

function Album() {
  const { albumId } = useParams();

  const [albumData, setAlbumData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getAlbum(albumId);
        setAlbumData(data);

        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [albumId]);

  const { setPlayingTrack } = useContext(TrackContext);

  return (
    <Layout>
      <div className='Album'>
        {albumData && (
          <>
            <div className='album-img-container'>
              <img
                src={albumData.images[0].url}
                alt='Album cover'
                className='album-img'
              />
            </div>
            <h1>{albumData.name}</h1>
          </>
        )}

        {albumData && (
          <>
            {albumData.tracks.items.map((item) => {
              return (
                <div
                  key={item.id}
                  className='track-card'
                  onClick={() => setPlayingTrack(item.uri)}
                >
                  <div className='track-title'>
                    <h3>{item.name}</h3>
                    <p>{item.artists[0].name}</p>
                  </div>
                  <p>{millisToMinutesAndSeconds(item.duration_ms)}</p>
                </div>
              );
            })}
          </>
        )}
      </div>
    </Layout>
  );
}

export default Album;
