import { View, Text, FlatList, ActivityIndicator, Image } from "react-native";
import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import { getMovies, Movie } from "@/services/api";
import useFetch from "@/services/useFetch";

export default function Index() {
  const [searchText, setSearchText] = useState("");

  const { data: movies, loading, refetch } = useFetch<Movie[], typeof getMovies>(
    getMovies,
    false,
    [searchText]
  );

  useEffect(() => {
    const query = searchText.trim() === "" ? "Marvel" : searchText;
    
    const timer = setTimeout(() => {
      refetch(query); 
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  return (
    <View className="flex-1 bg-black px-4 pt-10">
      <Text className="text-white text-2xl font-bold mb-4 mt-10">Movies</Text>
      
      <SearchBar
        placeholder="Search..."
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />

      {loading ? (
        <ActivityIndicator color="white" className="mt-10" />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item }) => <MovieCard {...item} />}
          columnWrapperStyle={{ justifyContent: 'space-between', gap: 10 }}
          ListEmptyComponent={<Text className="text-gray-500 text-center mt-10">No results found.</Text>}
        />
      )}
    </View>
  );
}