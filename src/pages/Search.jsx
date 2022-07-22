import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { search } from '../lib/spotify';
import Layout from '../layouts/Layout';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './Search.css';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await search(searchQuery);
        setSearchResults(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [searchQuery]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(e.target[0].value);
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <input
          type={'text'}
          className='search-input'
          placeholder='Artists or albums...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input type={'submit'} value='Search' className='submit-input' />
      </form>

      {searchResults && (
        <>
          <h2 className='albums-title'>Albums</h2>
          <Carousel swipeable={true} responsive={responsive}>
            {searchResults.albums.items.map((item) => {
              return (
                <Link key={item.id} to={`/albums/${item.id}`}>
                  <div className='albums-card'>
                    <img
                      src={item.images[0].url}
                      alt='Album cover'
                      className='albums-img'
                    />
                    <p>{item.name}</p>
                  </div>
                </Link>
              );
            })}
          </Carousel>
        </>
      )}
      {searchResults && (
        <>
          <h2 className='artists-title'>Artists</h2>
          <Carousel swipeable={true} responsive={responsive}>
            {searchResults.artists.items.map((item) => {
              return (
                <Link key={item.id} to={`/artists/${item.id}`}>
                  <div className='artists-card'>
                    {item.images && item.images.length > 1 ? (
                      <img
                        src={item.images[0].url}
                        alt='Artist avatar'
                        className='artists-img'
                      />
                    ) : null}
                    <p>{item.name}</p>
                  </div>
                </Link>
              );
            })}
          </Carousel>
        </>
      )}
    </Layout>
  );
}

export default Search;
