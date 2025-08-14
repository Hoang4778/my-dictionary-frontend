import Definition from "@/components/Definition";
import Examples from "@/components/Examples";
import MarkFavorites from "@/components/MarkFavorites";
import Phonetic from "@/components/Phonetic";
import Pronunciation from "@/components/Pronunciation";
import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { Stack, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WordDetail() {
  const { word }: { word: string } = useLocalSearchParams();
  const { theme } = useTheme();

  async function saveWordEntry() {
    const recentWordStr = await SecureStore.getItemAsync("recentWords");

    if (recentWordStr != null) {
      const recentWords = JSON.parse(recentWordStr);

      if (Array.isArray(recentWords)) {
        const filteredRecentWords = recentWords.filter((recentWord) => recentWord != word);
        filteredRecentWords.unshift(word);
        await SecureStore.setItemAsync("recentWords", JSON.stringify(filteredRecentWords));
      } else {
        const newRecentWords = [word];
        await SecureStore.setItemAsync("recentWords", JSON.stringify(newRecentWords));
      }
    } else {
      const newRecentWords = [word];
      await SecureStore.setItemAsync("recentWords", JSON.stringify(newRecentWords));
    }
  }

  useEffect(() => {
    saveWordEntry();
  }, []);

  return (
    <SafeAreaView style={styles.screenLayer} edges={["bottom"]}>
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
      <ScrollView style={[styles.screenWrapper, { backgroundColor: Colors[theme].background }]}>
        <Text style={[styles.title, { color: Colors[theme].text }]}>{word}</Text>
        <View style={styles.pronunciation}>
          <Phonetic word={word} />
          <Pronunciation word={word} />
        </View>
        <MarkFavorites styling={styles.markFavWord} wordToMark={word} />
        <Definition styling={styles.definition} word={word} />
        <Examples styling={styles.examples} word={word} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenLayer: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 600,
    textAlign: "center",
  },
  pronunciation: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    alignItems: "center",
    marginTop: 16,
  },
  markFavWord: {
    alignSelf: "center",
    marginTop: 8,
  },
  definition: {
    marginTop: 16,
    gap: 8,
  },
  examples: {
    marginTop: 16,
    gap: 8,
  },
});
