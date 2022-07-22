import { useEffect, useState } from 'react';
import { accessToken } from './lib/spotify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Artist from './pages/Artist';
import Playlist from './pages/Playlist';
import Album from './pages/Album';
import Search from './pages/Search';
import './App.css';
import TrackContextProvider from './contexts/TrackContext';

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(accessToken);
  }, []);

  return (
    <TrackContextProvider>
      <div className='App'>
        {!token ? (
          <Login />
        ) : (
          <>
            <Router>
              <Routes>
                <Route path='/search' element={<Search />} />
                <Route path='/albums/:albumId' element={<Album />} />
                <Route path='/artists/:artistId' element={<Artist />} />
                <Route path='/playlists/:playlistId' element={<Playlist />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/' element={<Home />} />
              </Routes>
            </Router>
          </>
        )}
      </div>
    </TrackContextProvider>
  );
}

export default App;
