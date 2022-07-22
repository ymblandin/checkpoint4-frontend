import React from 'react';
import { Link } from 'react-router-dom';
import profile from '../assets/profile.png';
import home from '../assets/home.png';
import search from '../assets/search.png';
import { logout } from '../lib/spotify';
import './Navigation.css';

function Navigation() {
  return (
    <nav className='Navigation'>
      <div className='links-container'>
        <Link to='/'>
          <img src={home} alt='Home icon' />
        </Link>
        <Link to='/profile'>
          <img src={profile} alt='Profile icon' />
        </Link>
        <Link to='/search'>
          <img src={search} alt='Search icon' />
        </Link>
      </div>
      <button className='btn-logout' onClick={logout}>
        Log Out
      </button>
    </nav>
  );
}

export default Navigation;
