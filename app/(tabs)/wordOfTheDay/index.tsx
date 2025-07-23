import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

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
  const [isFavorite, setIsFavorite] = useState(false);

  async function markFavoriteWord() {
    try {
      const favoriteWordsStr = await SecureStore.getItemAsync("favoriteWords");

      if (favoriteWordsStr != null) {
        const favoriteWords = JSON.parse(favoriteWordsStr);

        if (Array.isArray(favoriteWords)) {
          const filteredFavoriteWords = favoriteWords.filter(
            (word) => word != wordOfTheDay
          );
          filteredFavoriteWords.unshift(wordOfTheDay);
          const newFavoriteWordsStr = JSON.stringify(filteredFavoriteWords);
          await SecureStore.setItemAsync("favoriteWords", newFavoriteWordsStr);
        } else {
          const newFavoriteWords = [];
          newFavoriteWords.unshift(wordOfTheDay);
          const newFavoriteWordsStr = JSON.stringify(newFavoriteWords);
          await SecureStore.setItemAsync("favoriteWords", newFavoriteWordsStr);
        }
      } else {
        const newFavoriteWords = [];
        newFavoriteWords.unshift(wordOfTheDay);
        const newFavoriteWordsStr = JSON.stringify(newFavoriteWords);
        await SecureStore.setItemAsync("favoriteWords", newFavoriteWordsStr);
      }

      setIsFavorite(true);
      Toast.show({
        type: "success",
        text1: "Word marked as favorite successfully.",
        position: "top",
      });
    } catch (error: any) {
      setIsFavorite(false);
      Toast.show({
        type: "error",
        text1: error.message,
        position: "top",
      });
    }
  }

  async function unmarkFavoriteWord() {
    try {
      const favoriteWordsStr = await SecureStore.getItemAsync("favoriteWords");

      if (favoriteWordsStr != null) {
        const favoriteWords = JSON.parse(favoriteWordsStr);

        if (Array.isArray(favoriteWords)) {
          const favoriteWordIdx = favoriteWords.indexOf(wordOfTheDay);

          if (favoriteWordIdx > -1) {
            favoriteWords.splice(favoriteWordIdx, 1);
            const newFavoriteWordsStr = JSON.stringify(favoriteWords);
            await SecureStore.setItemAsync(
              "favoriteWords",
              newFavoriteWordsStr
            );
          } else {
            Toast.show({
              type: "error",
              text1:
                "Failed to save your favorite word. Please try again later",
              position: "top",
            });
          }
        } else {
          const newFavoriteWords = [] as string[];
          const newFavoriteWordsStr = JSON.stringify(newFavoriteWords);
          await SecureStore.setItemAsync("favoriteWords", newFavoriteWordsStr);
        }
      } else {
        const newFavoriteWords = [] as string[];
        const newFavoriteWordsStr = JSON.stringify(newFavoriteWords);
        await SecureStore.setItemAsync("favoriteWords", newFavoriteWordsStr);
      }

      setIsFavorite(false);
      Toast.show({
        type: "success",
        text1: "Favorite word unmarked successfully.",
        position: "top",
      });
    } catch (error: any) {
      setIsFavorite(true);
      Toast.show({
        type: "error",
        text1: error.message,
        position: "top",
      });
    }
  }

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

        const favoriteWordsStr = await SecureStore.getItemAsync(
          "favoriteWords"
        );

        if (favoriteWordsStr != null) {
          const favoriteWords = JSON.parse(favoriteWordsStr);

          if (Array.isArray(favoriteWords)) {
            const isThisWordFavorite = favoriteWords.includes(result?.word);

            if (isThisWordFavorite == true) {
              setIsFavorite(true);
            }
          }
        }

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
        <Text>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.wrapper, { paddingBottom: tabBarHeight }]}
    >
      <View>
        {isFavorite ? (
          <TouchableOpacity onPress={unmarkFavoriteWord}>
            <Ionicons name="bookmark" size={30} color={Colors.light.tint} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={markFavoriteWord}>
            <Ionicons
              name="bookmark-outline"
              size={30}
              color={Colors.light.tint}
            />
          </TouchableOpacity>
        )}
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
  },
  errorWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    flexGrow: 1,
  },
});
