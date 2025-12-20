import { ScrollView, Image, Text, View, ActivityIndicator, FlatList } from "react-native";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard"; 
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import useFetch from "@/services/useFetch";
import { getHomeMovies, WatchmodeMovie } from "@/services/api"; 

export default function Index() {
  const [searchText, setSearchText] = useState<string>('');
  const router = useRouter();

  const {
  data: movies,
  loading: moviesLoading,
  error: moviesError,
  refetch,
} = useFetch<WatchmodeMovie[], (query?: string, page?: number) => Promise<WatchmodeMovie[]>>(
  getHomeMovies,
  true,
  [searchText] 
);

useEffect(() => {
  refetch(searchText); 
}, [searchText]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        <View className="flex-1 mt-5">
          <SearchBar
            onPress={() => {
              router.push("/search");
            }}
            placeholder="Search for a movie"
          />

          {moviesLoading ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              className="mt-10 self-center"
            />
          ) : moviesError ? (
            <Text className="text-white">Error: {moviesError?.message}</Text>
          ) : (
            <View className="mt-5">
              <Text className="text-lg text-white font-bold mb-3">
                {searchText ? `Results for "${searchText}"` : "Latest Movies"}
              </Text>

              <FlatList
                data={movies || []} 
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}