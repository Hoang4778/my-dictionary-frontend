import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Favorites() {
  const [favoriteWords, setFavoriteWords] = useState([] as string[]);
  const [loadingState, setLoadingState] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchFavoriteWords() {
    setLoadingState(true);

    try {
      const favoriteWordsStr = await SecureStore.getItemAsync("favoriteWords");

      if (favoriteWordsStr != null) {
        const favoriteWords = JSON.parse(favoriteWordsStr);

        if (Array.isArray(favoriteWords)) {
          setFavoriteWords(favoriteWords);
        } else {
          setErrorMessage(
            "Something went wrong with rendering favorite words. Please try again later."
          );
        }
      }

      setLoadingState(false);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchFavoriteWords();
    }, [])
  );

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
    <View>
      {favoriteWords.length > 0 ? (
        <FlatList
          data={favoriteWords}
          renderItem={({ item }) => (
            <Link
              style={styles.wordItemWrapper}
              href={{ pathname: "/[word]", params: { word: item } }}
            >
              <Text style={styles.wordItem}>{item}</Text>
            </Link>
          )}
        />
      ) : (
        <View>
          <Text>There is no favorite words yet.</Text>
          <Text>
            You can try to click the
            <Ionicons
              name="bookmark-outline"
              size={25}
              color={Colors.light.tint}
            />
            icon in the entry screen to mark your first favorite word
          </Text>
        </View>
      )}
    </View>
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
  wordItemWrapper: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#cdcdcdff",
  },
  wordItem: {
    fontSize: 18,
  },
});
