import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getArtists, getArtistAlbums } from '../lib/spotify';
import Layout from '../layouts/Layout';
import './Artist.css';

function Artist() {
  const { artistId } = useParams();

  const [artistData, setArtistData] = useState(null);
  const [artistAlbums, setArtistAlbums] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getArtists(artistId);
        setArtistData(data);

        const albums = await getArtistAlbums(artistId);
        setArtistAlbums(albums.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [artistId]);

  return (
    <Layout>
      <div className='Artist'>
        {artistData && (
          <>
            <div className='artist-img-container'>
              <img
                src={artistData.images[0].url}
                alt='Artist avatar'
                className='artist-img'
              />
            </div>
            <h1>{artistData.name}</h1>
          </>
        )}

        {artistAlbums && (
          <>
            {artistAlbums.items.map((item) => {
              return (
                <Link key={item.id} to={`/albums/${item.id}`}>
                  <div className='album-card'>
                    <img
                      className='album-img'
                      src={item.images[0].url}
                      alt='Album cover'
                    />
                    <div className='album-title'>
                      <h3>{item.name}</h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </>
        )}
      </div>
    </Layout>
  );
}

export default Artist;
