import { ScrollView,View, Text, FlatList, ActivityIndicator, Image } from "react-native";
import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import { getMovies, Movie } from "@/services/api";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
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
    <View className="flex-1 bg-primary w-full ">
      <Image source={images.bg} className="absolute w-full z-0" resizeMode="cover" />

      <View className="flex-1 px-5 min-h-100% pb-10">
        
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
    <View className="flex-1 bg-black mt-5 mb-5 ">
      <SearchBar
        placeholder="Search..."
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <Text className="text-white text-xl font-bold mt-3 mb-2">Movies</Text>
      
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
    </View>
    </View>
  );
}