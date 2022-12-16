const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, 'credentials/.env'),
});
const fetch = require('node-fetch');

const TMBD_API_KEY = process.env.TMBD_API_KEY;
const api = 'https://api.themoviedb.org/3';

const configuration = async () => {
  try {
    const response = await fetch(
      `${api}/configuration?api_key=${TMBD_API_KEY}`
    );

    const data = await response.json();

    return {
      base_url: data.images.base_url,
      size: data.images.poster_sizes[3],
    };
  } catch (error) {
    console.error(error);
  }
};

async function search(phrase, opt) {
  const term = encodeURI(phrase);

  try {
    const response = await fetch(
      `${api}/search/${opt}?api_key=${TMBD_API_KEY}&query=${term}&page=1&include_adult=false`
    );

    const data = await response.json();

    if (opt === 'movie') {
      return {
        title: data.results[0].title,
        overview: data.results[0].overview,
        img: data.results[0].poster_path,
        avgRating: data.results[0].vote_average,
      };
    } else if (opt === 'tv') {
      console.log(1);
      return {
        title: data.results[0].name,
        overview: data.results[0].overview,
        img: data.results[0].poster_path,
        avgRating: data.results[0].vote_average,
      };
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  configuration,
  search,
};