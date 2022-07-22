import { Link } from 'react-router-dom';
import { getTopArtists, getUserPlaylists } from '../lib/spotify';
import { useEffect, useState } from 'react';
import Layout from '../layouts/Layout';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './Home.css';

function Home() {
  const [topArtists, setTopArtists] = useState(null);
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const artists = await getTopArtists();
        setTopArtists(artists.data);

        const userPlaylists = await getUserPlaylists();
        setPlaylists(userPlaylists.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Settings for the carousel
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 7,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 5,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3,
    },
  };

  return (
    <Layout>
      <div className='Home'>
        <div className='home-header'>
          <h1>Hello</h1>
        </div>

        {topArtists && (
          <>
            <h2 className='top-artists-title'>Top Artists</h2>
            <Carousel swipeable={true} responsive={responsive}>
              {topArtists.items.map((item) => {
                return (
                  <Link key={item.id} to={`/artists/${item.id}`}>
                    <div className='top-artists-card'>
                      <img
                        src={item.images[0].url}
                        alt='Artist image'
                        className='top-artists-img'
                      />
                      <p>{item.name}</p>
                    </div>
                  </Link>
                );
              })}
            </Carousel>
          </>
        )}

        {playlists && (
          <>
            <h2 className='playlist-title'>Playlists</h2>
            <Carousel swipeable={true} responsive={responsive}>
              {playlists.items.map((item) => {
                return (
                  <Link key={item.id} to={`/playlists/${item.id}`}>
                    <div className='playlist-card'>
                      <img
                        src={item.images[0].url}
                        alt='Playlist image'
                        className='playlist-img'
                      />
                      <p>{item.name}</p>
                    </div>
                  </Link>
                );
              })}
            </Carousel>
          </>
        )}
      </div>
    </Layout>
  );
}

export default Home;
