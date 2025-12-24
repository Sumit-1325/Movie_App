const API_KEY = process.env.EXPO_PUBLIC_OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";

export interface Movie {
  id: string;
  title: string;
  poster_path: string;
  release_date: string;
}

export async function getMovies(query: string = ""): Promise<Movie[]> {
  const key = API_KEY || "";
  
  
  const discoveryKeywords = [
    "Marvel", "Star Wars", "Avengers", "Batman", "Mission", 
    "Harry Potter", "Jurassic", "Fast", "Spider", "Matrix"
  ];

  const isRandomSearch = !query || query.trim() === "";
  const safeQuery = isRandomSearch 
    ? discoveryKeywords[Math.floor(Math.random() * discoveryKeywords.length)]
    : query.trim();

  const url = `${BASE_URL}?apikey=${key}&s=${encodeURIComponent(safeQuery)}&type=movie`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True" && data.Search) {
  let results = data.Search.map((item: any) => ({
    id: item.imdbID,
    title: item.Title,
    poster_path: item.Poster !== "N/A" ? item.Poster : "https://via.placeholder.com/300x450",
    release_date: item.Year,
  }));

  // Optional: Remove potential duplicates by ID
  results = results.filter((movie, index, self) =>
    index === self.findIndex((m) => m.id === movie.id)
  );

  if (isRandomSearch) {
    results = results.sort(() => Math.random() - 0.5);
  }

  return results;
}
    
    if (data.Response === "False") {
      console.log("OMDb Error:", data.Error);
    }
    return [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}