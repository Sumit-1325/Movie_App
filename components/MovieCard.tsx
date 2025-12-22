import { Link } from "expo-router";
import { Text, Image, TouchableOpacity, View } from "react-native";
import { Movie } from "@/services/api";

const MovieCard = ({ id, poster_path, title, release_date }: Movie) => {
  return (
    // Wrap with Link for routing to details
    <Link href={`/movie/${id}`} asChild>
      <TouchableOpacity className="w-[31%] mb-4">
        <View className="bg-gray-800 rounded-lg overflow-hidden">
          <Image
            source={{ uri: poster_path }}
            className="w-full h-48"
            resizeMode="cover"
          />
        </View>
        <Text className="text-white font-bold text-xs mt-2" numberOfLines={1}>
          {title}
        </Text>
        <Text className="text-gray-400 text-[10px]">{release_date}</Text>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;