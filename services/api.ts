import { fetch } from "react-native-fetch-api";

const API_KEY = process.env.EXPO_PUBLIC_OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";

export interface Movie {
  id: string;
  title: string;
  poster_path: string;
  release_date: string;
}

export async function getMovies(query: string = "Marvel"): Promise<Movie[]> {
  if (!API_KEY) {
    console.error("Missing EXPO_PUBLIC_OMDB_API_KEY in .env file");
    return [];
  }

  const searchTerm = query.trim() === "" ? "Marvel" : query;
  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}&type=movie`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True" && data.Search) {
      return data.Search.map((item: any) => ({
        id: item.imdbID,
        title: item.Title,
        poster_path: item.Poster !== "N/A" ? item.Poster : "https://via.placeholder.com/300x450",
        release_date: item.Year,
      }));
    }
    return [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}