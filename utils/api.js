const apiKey = '5b384ctkly5E66LJpbA9TFRH4xzu05N8BrcUhLdphUYwyzx2jMfDaErz';

export const fetchSong = async song => {
  const response = await fetch(`https://api.happi.dev/v1/music?q=${song}`, {
    "method": "GET",
    "headers": {
      "x-happi-key": '5b384ctkly5E66LJpbA9TFRH4xzu05N8BrcUhLdphUYwyzx2jMfDaErz',
	  }
  });

  const results = await response.json();
  const { id_artist, id_track, id_album, track, artist, cover } = results.result[0];

  return {
    artistId: id_artist,
    songId: id_track,
    albumId: id_album,
    song: track,
    artist,
    coverLink: cover,
  }
};

export const fetchLyrics = async (artistId, songId, albumId) => {
  const response = await fetch(`https://api.happi.dev/v1/music/artists/${artistId}/albums/${albumId}/tracks/${songId}/lyrics`, {
    "method": "GET",
    "headers": {
      "x-happi-key": '5b384ctkly5E66LJpbA9TFRH4xzu05N8BrcUhLdphUYwyzx2jMfDaErz',
	  }
  });

  const result = await response.json();
  const { lyrics } = result.result;
  return lyrics;
};