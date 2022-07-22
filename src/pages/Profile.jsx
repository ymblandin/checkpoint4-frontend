import { useEffect, useState } from 'react';
import { getUserProfile, getFollowedArtists } from '../lib/spotify';
import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import './Profile.css';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [followedArtists, setFollowedArtists] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await getUserProfile();
        setProfile(userProfile.data);

        const userArtists = await getFollowedArtists();
        setFollowedArtists(userArtists.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout>
      {profile && (
        <header className='header'>
          <div className='header-inner'>
            {profile.images.length && profile.images[0].url && (
              <>
                <div className='header-img-container'>
                  <img src={profile.images[0].url} alt='Avatar' />
                </div>
              </>
            )}

            <div>
              <h1 className='header-name'>{profile.display_name}</h1>
              <p className='header-data'>
                <span>
                  {profile.followers.total} Follower
                  {profile.followers.total !== 1 ? 's' : ''}
                </span>
              </p>
            </div>
          </div>
        </header>
      )}

      {followedArtists && (
        <>
          <h2 className='followed-artist-title'>
            Followed artist{followedArtists.total !== 1 ? 's' : ''}
          </h2>

          {followedArtists.artists.items.map((item) => (
            <Link key={item.id} to={`/artists/${item.id}`}>
              <div className='followed-artists-card'>
                <img
                  className='followed-artists-img'
                  src={item.images[0].url}
                  alt='Artist image'
                />
                <div className='followed-artists-title'>
                  <h3>{item.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </>
      )}
    </Layout>
  );
}

export default Profile;
