import { Link } from "expo-router";
import { ScrollView, Image, Text, View } from "react-native";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-primary">
      <Image 
        source={images.bg} 
        className="absolute w-full h-full" 
        resizeMode="cover"
      />

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 10 }}
      >
        <Image 
          source={icons.logo} 
          className="w-12 h-10 mt-20 mb-5 mx-auto" 
        />
        <View className="flex-1 mt-5">
          <SearchBar 
          onPress={() => router.push('/search')}  
          placeholder="Search For the Movies"
          />
        </View>
      </ScrollView>
    </View>
  );
}