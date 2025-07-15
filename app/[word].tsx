import { Colors } from "@/constants/Colors";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function WordDetail() {
  const { word }: { word: string } = useLocalSearchParams();

  return (
    <View>
      <Stack.Screen
        name="[word]"
        options={{
          headerTitle: word,
          headerStyle: {
            backgroundColor: Colors.light.tint,
          },
          headerTintColor: "white",
        }}
      />
      <Text>This is the "{word}" detail screen</Text>
    </View>
  );
}
