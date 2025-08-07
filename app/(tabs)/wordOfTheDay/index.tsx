import MarkFavorites from "@/components/MarkFavorites";
import { Colors } from "@/constants/Colors";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function WordOfTheDayScreen() {
  const [wordOfTheDay, setWordOfTheDay] = useState("");
  const [definition, setDefinition] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("");
  const [history, setHistory] = useState("");
  const [examples, setExamples] = useState([]);
  const [todayDate, setTodayDate] = useState("");

  const tabBarHeight = useBottomTabBarHeight();
  const [loadingState, setLoadingState] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchWordOfTheDay() {
    setLoadingState(true);
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
        const result = await response.json();

        setTodayDate(
          `${dateObj.toLocaleString("default", {
            month: "long",
          })} ${currentDate}, ${currentYear}`
        );
        setWordOfTheDay(result?.word);
        setDefinition(result?.definitions[0]?.text);
        setPartOfSpeech(result?.definitions[0]?.partOfSpeech);
        setExamples(Array.isArray(result?.examples) ? result?.examples : []);
        setHistory(result?.note);
      } else {
        setErrorMessage(
          "Something went wrong with the API call. Please try again."
        );
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
    setLoadingState(false);
  }

  useEffect(() => {
    fetchWordOfTheDay();
  }, []);

  if (loadingState == true) {
    return (
      <View style={styles.loadingIconWrapper}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  if (errorMessage != "") {
    return (
      <View style={styles.errorWrapper}>
        <Text style={{ textAlign: "center" }}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.wrapper, { paddingBottom: tabBarHeight }]}
    >
      <View>
        <MarkFavorites wordToMark={wordOfTheDay} />
        <Text>Word: {wordOfTheDay}</Text>
        <Text>Date: {todayDate}</Text>
        <Text>Part of speech: {partOfSpeech}</Text>
        <Text>Definition: {definition}</Text>
        <View>
          <Text>Examples</Text>
          {examples.map((example: any) => (
            <Text key={example.id}>
              "{example.text}" - {example.title}
            </Text>
          ))}
        </View>
        <Text>History: {history}</Text>
        <Link href={{ pathname: "/[word]", params: { word: wordOfTheDay } }}>
          <Text>See the full entry</Text>
        </Link>
      </View>
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
  },
});
