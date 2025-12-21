import { fetch } from "react-native-fetch-api";

const API_KEY = process.env.EXPO_PUBLIC_MOVIE_SEARCH_API_KEY;
const BASE_URL = "https://api.watchmode.com/v1";

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

const GENRE_MAP: Record<string, number> = {
  action: 1,
  adventure: 2,
  animation: 3,
  comedy: 4,
  crime: 5,
  documentary: 6,
  fantasy: 7,
  horror: 8,
  musical: 12,
  mystery: 13,
  romance: 14,
  "sci-fi": 15,
  thriller: 17,
  western: 19,
};

// Exported search function
export async function searchMovies(
  query?: string,
  genre?: string
): Promise<Movie[]> {
  if (!API_KEY) return [];

  let url = "";
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
    const data = await response.json();
    const rawData = data.title_results || data.titles || [];

    // In both searchMovies and getLatestMovies mapping
    return rawData.map((item: any) => ({
      id: item.id,
      title: item.name || item.title || "Unknown Title",
      // Use a placeholder if both image fields are missing
      poster_path:
        item.image_url ||
        item.poster_url ||
        "https://via.placeholder.com/300x450.png?text=No+Image",
      vote_average: 0,
      release_date: item.year ? `${item.year}-01-01` : "2024-01-01",
    }));
  } catch (error) {
    return [];
  }
}

// Exported Latest Movies function
export async function getLatestMovies(page: number = 1): Promise<Movie[]> {
  if (!API_KEY) return [];
  // In getLatestMovies
  const url = `${BASE_URL}/list-titles/?apiKey=${API_KEY}&types=movie&sort_by=release_date_desc&regions=US&page=${page}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // NEW: Check exactly what the API said
    console.log("WATCHMODE RAW RESPONSE:", data);
    const rawData = data.titles || [];

    // In both searchMovies and getLatestMovies mapping
    return rawData.map((item: any) => ({
      id: item.id,
      title: item.name || item.title || "Unknown Title",
      // Use a placeholder if both image fields are missing
      poster_path:
        item.image_url ||
        item.poster_url ||
        "https://via.placeholder.com/300x450.png?text=No+Image",
      vote_average: 0,
      release_date: item.year ? `${item.year}-01-01` : "2024-01-01",
    }));
  } catch (error) {
    return [];
  }
}

// Exported Wrapper function
export async function getHomeMovies(
  query?: string,
  page: number = 1,
  genre?: string
): Promise<Movie[]> {
  if ((query && query.trim().length > 0) || genre) {
    return searchMovies(query, genre);
  }
  return getLatestMovies(page);
}
