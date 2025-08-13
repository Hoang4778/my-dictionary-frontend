import MarkFavorites from "@/components/MarkFavorites";
import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

export default function WordOfTheDayScreen() {
  const [wordOfTheDay, setWordOfTheDay] = useState(null) as any;
  const [todayDate, setTodayDate] = useState("");
  const tabBarHeight = useBottomTabBarHeight();
  const [loadingState, setLoadingState] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const platform = Platform.OS;
  const { theme } = useTheme();

  async function fetchWordOfTheDay() {
    try {
      const dateObj = new Date();
      const currentYear = dateObj.getFullYear();
      const currentMonth = dateObj.getMonth() + 1;
      const currentDate = dateObj.getDate();
      const dateStr = `${currentYear}-${
        currentMonth < 10 ? "0" + currentMonth : currentMonth
      }-${currentDate}`;

      const apiURL = process.env.EXPO_PUBLIC_WORDNIK_API_URL;
      const apiKey = process.env.EXPO_PUBLIC_WORDNIK_API_KEY;

      if (apiURL && apiKey) {
        const response = await fetch(
          `${apiURL}/words.json/wordOfTheDay?date=${dateStr}&api_key=${apiKey}`
        );

        if (response.status == 200) {
          const result = await response.json();

          setTodayDate(
            `${dateObj.toLocaleString("default", {
              month: "long",
            })} ${currentDate}, ${currentYear}`
          );
          setWordOfTheDay(result);
        } else {
          setErrorMessage("Something went wrong with fetching the word. Please try again later.");
        }
      } else {
        setErrorMessage("Something went wrong with the API call. Please try again.");
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoadingState(false);
    }
  }

  useEffect(() => {
    fetchWordOfTheDay();
  }, []);

  if (loadingState == true) {
    return (
      <View style={[styles.loadingIconWrapper, { backgroundColor: Colors[theme].background }]}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  if (errorMessage != "") {
    return (
      <View style={[styles.errorWrapper, { backgroundColor: Colors[theme].background }]}>
        <Text style={{ textAlign: "center", color: Colors[theme].text }}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.wrapper,
        {
          paddingBottom: platform == "ios" ? tabBarHeight + 16 : 16,
          backgroundColor: Colors[theme].background,
        },
      ]}
    >
      <Text style={[styles.date, { color: Colors[theme].text }]}>{todayDate}</Text>
      <Text style={[styles.word, { color: Colors[theme].text }]}>{wordOfTheDay.word}</Text>
      <View style={styles.markFavorite}>
        <Text style={[styles.partOfSpeech, { color: Colors[theme].text }]}>
          {wordOfTheDay.definitions[0]?.partOfSpeech}
        </Text>
        <MarkFavorites wordToMark={wordOfTheDay.word} />
      </View>
      <View style={styles.definitions}>
        <Text style={[styles.definitionsLabel, { color: Colors[theme].text }]}>What it means:</Text>
        <Text style={[styles.text, { color: Colors[theme].text }]}>
          {wordOfTheDay.definitions[0]?.text}
        </Text>
      </View>
      <View style={styles.examples}>
        <Text style={[styles.examplesLabel, { color: Colors[theme].text }]}>Examples</Text>
        {wordOfTheDay.examples?.map((example: any) => (
          <Text key={example.id} style={[styles.text, { color: Colors[theme].text }]}>
            "{example.text}" -{" "}
            <Text style={[styles.examplesAuthor, { color: Colors[theme].text }]}>
              {example.title}
            </Text>
          </Text>
        ))}
      </View>
      <View style={styles.history}>
        <Text style={[styles.historyLabel, { color: Colors[theme].text }]}>Did you know?</Text>
        <Text style={[styles.text, { color: Colors[theme].text }]}>{wordOfTheDay.note}</Text>
      </View>
      <Link
        style={[styles.fullEntryLink, { color: Colors.light.tint }]}
        href={{ pathname: "/[word]", params: { word: wordOfTheDay.word } }}
      >
        <Text>See the full entry {">>"}</Text>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingIconWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  wrapper: {
    flexGrow: 1,
    padding: 16,
    gap: 16,
  },
  date: {
    textAlign: "center",
  },
  word: {
    fontSize: 32,
    textAlign: "center",
    fontWeight: "700",
  },
  markFavorite: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  partOfSpeech: {
    fontStyle: "italic",
  },
  definitions: {
    gap: 8,
  },
  definitionsLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
  examples: {
    gap: 8,
  },
  examplesLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
  examplesAuthor: {
    fontStyle: "italic",
    fontWeight: 500,
  },
  history: {
    gap: 8,
  },
  historyLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
  fullEntryLink: {
    alignSelf: "center",
  },
  text: {
    textAlign: "justify",
  },
});
