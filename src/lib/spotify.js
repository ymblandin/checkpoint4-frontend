import axios from 'axios';

// All the keys for the localstorage
const LOCALSTORAGE_KEYS = {
  accessToken: 'spotify_access_token',
  refreshToken: 'spotify_refresh_token',
  expireTime: 'spotify_token_expire_time',
  timestamp: 'spotify_token_timestamp',
};

// All the values from the localstorage
const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
};

export const logout = () => {
  // Clear all localStorage items
  for (const property in LOCALSTORAGE_KEYS) {
    window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
  }
  // Navigate to homepage
  window.location = window.location.origin;
};

// Check if the amount of time that has elapsed between the timestamp in localstorage and now is greater than the expiration time of 1 hour (3600 s)
const hasTokenExpired = () => {
  const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;
  if (!accessToken || !timestamp) {
    return false;
  }
  const millisecondsElapsed = Date.now() - Number(timestamp);
  return millisecondsElapsed / 1000 > Number(expireTime);
};

// Get a new access token with the refresh token saved in the localstorage and update the localstorage accordingly
const refreshToken = async () => {
  try {
    const { refreshToken, timestamp } = LOCALSTORAGE_VALUES;
    // Logout if there's no refresh token stored or we've managed to get into a reload infinite loop
    if (
      !refreshToken ||
      refreshToken === 'undefined' ||
      Date.now() - Number(timestamp) / 1000 < 1000
    ) {
      console.error('No refresh token available');
      logout();
    }

    // Use the /refresh_token endpoint to get a new refresh token
    const { data } = await axios.get(
      `http://localhost:5000/refresh_token?refresh_token=${refreshToken}`
    );

    // Update localStorage values
    window.localStorage.setItem(
      LOCALSTORAGE_KEYS.accessToken,
      data.access_token
    );
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());

    // Reload the page for localStorage updates to be reflected
    window.location.reload();
  } catch (err) {
    console.error(err);
  }
};

// Get the access token from the localstorage or the query params
const getAccessToken = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get('access_token'), // 'spotify_access_token': BQDvxEHZOxtIZObTo77BBpU4fGBq2ZLtFdmPKDtI2hcNArNX5QumDSGgn03_Wn_0awuhTos0h8Ow8UM-vgAoF3LJQR-1rD-uLhJMswEuAjQrvcFM_46BAlrEMK8n5h0Y0NpID-1-kJaRvxMLcuUsHfk8xBqBDDn3zq2f0n2EserQcggJT_1MqSmSlHJFgSfGGuIjbGkfwagIzFTwfCkJp750x_v35-XHl87WZPYlMzuGCb5UR1XHFlZLOzkUWF7ptxNUngNNVgcMEgyIUljGcVgW4uXf5sRk6piVXqgcwQ5ko4aNZBgVKM3nqg
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get('refresh_token'), // 'spotify_refresh_token': AQC72oCRf4aEgoIU2XKUyG6NyEOhBlSRy1rYhpQSKw-6HJZ4b1sEMesAXRLUFdq43l8kH9QX0dEAlQYCws_A7rCZJ6lU4z1y78JeHUhl1jxl3M3wnUSNYFRYKriHfXPV6J4
    [LOCALSTORAGE_KEYS.expireTime]: urlParams.get('expires_in'), // 'spotify_token_expire_time': 3600
  };
  const hasError = urlParams.get('error');

  // If there's an error OR the token in localStorage has expired, refresh the token
  if (
    hasError ||
    hasTokenExpired() ||
    LOCALSTORAGE_VALUES.accessToken === 'undefined'
  ) {
    refreshToken();
  }

  // If there is a valid access token in localStorage, return that access token
  if (
    LOCALSTORAGE_VALUES.accessToken &&
    LOCALSTORAGE_VALUES.accessToken !== 'undefined'
  ) {
    return LOCALSTORAGE_VALUES.accessToken;
  }

  // If there is an access token in the URL query params, it means that the user is logging in for the first time
  if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
    // For each query param (property) within the object queryParams, store the query params in localStorage
    for (const property in queryParams) {
      window.localStorage.setItem(property, queryParams[property]); // For the first property: window.localStorage.setItem('spotify_access_token', BQDvxEHZOxtIZObTo77BBpU4fGBq2ZLtFdmPKDtI2hcNArNX5QumDSGgn03_Wn_0awuhTos0h8Ow8UM-vgAoF3LJQR-1rD-uLhJMswEuAjQrvcFM_46BAlrEMK8n5h0Y0NpID-1-kJaRvxMLcuUsHfk8xBqBDDn3zq2f0n2EserQcggJT_1MqSmSlHJFgSfGGuIjbGkfwagIzFTwfCkJp750x_v35-XHl87WZPYlMzuGCb5UR1XHFlZLOzkUWF7ptxNUngNNVgcMEgyIUljGcVgW4uXf5sRk6piVXqgcwQ5ko4aNZBgVKM3nqg)
    }
    // One needs to set the timestamp as well
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
    // Return the access token from the query params
    return queryParams[LOCALSTORAGE_KEYS.accessToken];
  }

  // In case it did not work
  return false;
};

export const accessToken = getAccessToken();

// Set the headers and the base url for the future axios calls
axios.defaults.baseURL = 'https://api.spotify.com/v1';
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
axios.defaults.headers['Content-Type'] = 'application/json';

// Get the user's profile with the Spotify API
export const getUserProfile = () => axios.get('/me');

// Get the user's playlists
export const getUserPlaylists = (limit = 20) => {
  return axios.get(`/me/playlists?limit=${limit}`);
};

// Get the followed artists
export const getFollowedArtists = (limit = 20) => {
  return axios.get(`/me/following?type=artist&limit=${limit}`);
};

// Get user top artists
export const getTopArtists = (limit = 20) => {
  return axios.get(`/me/top/artists?limit=${limit}`);
};

// Get artist
export const getArtists = (id) => {
  return axios.get(`/artists/${id}`);
};

// Get artist albums
export const getArtistAlbums = (id) => {
  return axios.get(`/artists/${id}/albums`);
};

// Get playlist
export const getPlaylist = (id) => {
  return axios.get(`/playlists/${id}`);
};

// Get album data
export const getAlbum = (id) => {
  return axios.get(`/albums/${id}`);
};

// Search for item
export const search = (query) => {
  return axios.get(`/search?type=artist,album&q=${query}`);
};
