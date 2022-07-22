import React from 'react';
import spotify from '../assets/spotify.png';
import './Login.css';

function Login() {
  return (
    <main className='Login'>
      <img src={spotify} alt='Spotify logo' />
      <a className='btn-login' href='http://localhost:5000/login'>
        Log in to Spotify
      </a>
    </main>
  );
}

export default Login;
