import { fetch } from 'react-native-fetch-api';
import dotenv from 'dotenv';

dotenv.config();

interface WatchmodeMovie {
  id: number;
  name: string; 
  type: string;
  year: number;
  imdb_id?: string;
}

const GENRE_MAP: Record<string, number> = {
  "action": 1,
  "adventure": 2,
  "animation": 3,
  "comedy": 4,
  "crime": 5,
  "documentary": 6,
  "fantasy": 7,
  "horror": 8,
  "musical": 12,
  "mystery": 13,
  "romance": 14,
  "sci-fi": 15,
  "thriller": 17,
  "western": 19
};

const API_KEY: string | undefined = process.env.MOVIE_SEARCH_API_KEY;
const BASE_URL: string = 'https://api.watchmode.com/v1';

async function searchWatchmode(query?: string, genre?: string): Promise<WatchmodeMovie[]> {
  if (!API_KEY) return [];

  let url = '';

  if (query) {
    url = `${BASE_URL}/search/?apiKey=${API_KEY}&search_field=name&search_value=${encodeURIComponent(query)}`;
  } else if (genre) {
    const genreId = GENRE_MAP[genre.toLowerCase()];
    if (!genreId) return [];
    url = `${BASE_URL}/list-titles/?apiKey=${API_KEY}&genres=${genreId}&types=movie&sort_by=popularity_desc`;
  } else {
    return [];
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error();
    const data = await response.json();
    const rawData = data.title_results || data.titles || [];

    return rawData.map((item: any) => ({
      id: item.id,
      name: item.name || item.title, 
      type: item.type,
      year: item.year,
      imdb_id: item.imdb_id
    }));
  } catch (error) {
    return [];
  }
}

async function getLatestMovies(page: number = 1): Promise<WatchmodeMovie[]> {
  if (!API_KEY) return [];

  const url = `${BASE_URL}/list-titles/?apiKey=${API_KEY}&types=movie&sort_by=release_date_desc&page=${page}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error();
    const data = await response.json();
    const allLatest = data.titles || [];

    return allLatest.slice(0, 20).map((item: any) => ({
      id: item.id,
      name: item.name || item.title,
      type: item.type,
      year: item.year,
      imdb_id: item.imdb_id
    }));
  } catch (error) {
    return [];
  }
}

async function getHomeMovies(query?: string, page: number = 1): Promise<WatchmodeMovie[]> {
  if (query && query.trim().length > 0) {
    return searchWatchmode(query);
  }
  return getLatestMovies(page);
}

export { searchWatchmode, getLatestMovies, getHomeMovies, WatchmodeMovie };