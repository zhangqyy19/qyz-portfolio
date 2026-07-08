import React, { useState, useEffect, useCallback } from 'react';
import '../styles/SpotifyPlayer.scss';

// Replace with your Spotify app credentials
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const REDIRECT_URI = window.location.origin + window.location.pathname;
const SCOPES = 'user-read-currently-playing user-read-playback-state user-read-recently-played';

interface Track {
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  isPlaying: boolean;
  progress: number;
  duration: number;
}

const SpotifyPlayer: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check for token in URL hash on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      if (accessToken) {
        setToken(accessToken);
        localStorage.setItem('spotify_token', accessToken);
        // Clean URL
        window.history.replaceState(null, '', window.location.pathname);
      }
    } else {
      const stored = localStorage.getItem('spotify_token');
      if (stored) setToken(stored);
    }
  }, []);

  const fetchCurrentTrack = useCallback(async () => {
    if (!token) return;
    try {
      // Try currently playing first
      let res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 401) {
        localStorage.removeItem('spotify_token');
        setToken(null);
        setError(null);
        return;
      }

      if (res.status === 204 || !res.ok) {
        // No active playback, try recently played
        res = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            const item = data.items[0].track;
            setTrack({
              name: item.name,
              artist: item.artists.map((a: any) => a.name).join(', '),
              album: item.album.name,
              albumArt: item.album.images[0]?.url || '',
              isPlaying: false,
              progress: 0,
              duration: item.duration_ms
            });
          }
        }
        return;
      }

      const data = await res.json();
      if (data && data.item) {
        setTrack({
          name: data.item.name,
          artist: data.item.artists.map((a: any) => a.name).join(', '),
          album: data.item.album.name,
          albumArt: data.item.album.images[0]?.url || '',
          isPlaying: data.is_playing,
          progress: data.progress_ms || 0,
          duration: data.item.duration_ms
        });
        setError(null);
      }
    } catch {
      setError('Could not fetch track');
    }
  }, [token]);

  // Poll for current track
  useEffect(() => {
    if (!token) return;
    fetchCurrentTrack();
    const interval = setInterval(fetchCurrentTrack, 10000);
    return () => clearInterval(interval);
  }, [token, fetchCurrentTrack]);

  const handleLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
    window.location.href = authUrl;
  };

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  // Not logged in state
  if (!token) {
    return (
      <div className="spotify-player spotify-login">
        <div className="spotify-login-content">
          <div className="spotify-icon">♫</div>
          <h3>What I'm Listening To</h3>
          <p>Connect with Spotify to see what's playing</p>
          <button className="spotify-connect-btn" onClick={handleLogin}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Connect Spotify
          </button>
        </div>
      </div>
    );
  }

  // Loading / error state
  if (!track) {
    return (
      <div className="spotify-player">
        <div className="spotify-loading">
          {error ? <p>{error}</p> : <p>Loading...</p>}
        </div>
      </div>
    );
  }

  // Now playing
  const progressPercent = track.duration > 0 ? (track.progress / track.duration) * 100 : 0;

  return (
    <div className="spotify-player">
      <div className="spotify-album-art">
        <img src={track.albumArt} alt={track.album} />
        {track.isPlaying && (
          <div className="playing-indicator">
            <span /><span /><span />
          </div>
        )}
      </div>
      <div className="spotify-track-info">
        <div className="spotify-status">
          {track.isPlaying ? '♫ Now Playing' : '♫ Last Played'}
        </div>
        <h4 className="spotify-track-name">{track.name}</h4>
        <p className="spotify-artist">{track.artist}</p>
        <div className="spotify-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="progress-times">
            <span>{formatTime(track.progress)}</span>
            <span>{formatTime(track.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotifyPlayer;