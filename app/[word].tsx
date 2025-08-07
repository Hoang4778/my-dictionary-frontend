import Definition from "@/components/Definition";
import Examples from "@/components/Examples";
import MarkFavorites from "@/components/MarkFavorites";
import Phonetic from "@/components/Phonetic";
import Pronunciation from "@/components/Pronunciation";
import { Colors } from "@/constants/Colors";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function WordDetail() {
  const { word }: { word: string } = useLocalSearchParams();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
      <View>
        <MarkFavorites wordToMark={word} />
        <Text>{word}</Text>
        <Text>Mark favorite word</Text>
        <Phonetic word={word} />
        <Pronunciation word={word} />
        <Definition word={word} />
        <Examples word={word} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
