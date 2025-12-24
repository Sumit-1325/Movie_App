
const API_KEY = process.env.EXPO_PUBLIC_OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";

export interface Movie {
  id: string;
  title: string;
  poster_path: string;
  release_date: string;
}

// services/api.ts
export async function getMovies(query: string = "Marvel"): Promise<Movie[]> {
  const API_KEY = process.env.EXPO_PUBLIC_OMDB_API_KEY;
  const BASE_URL = "https://www.omdbapi.com/";

  const key = API_KEY || ""; 
  const safeQuery = (query || "Marvel").toString();
  const url = `${BASE_URL}?apikey=${key}&s=${encodeURIComponent(safeQuery)}&type=movie`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // ADD THIS LOG to see the actual error message from OMDb
    if (data.Response === "False") {
      console.log("OMDb Error Message:", data.Error);
    }

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
    return [];
  }
}