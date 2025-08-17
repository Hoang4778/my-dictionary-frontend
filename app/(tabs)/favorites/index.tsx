import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { deleteFavoriteWords } from "@/hooks/deleteFavWords";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function Favorites() {
  const [favoriteWords, setFavoriteWords] = useState([] as string[]);
  const [loadingState, setLoadingState] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { theme } = useTheme();

  async function fetchFavoriteWords() {
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
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoadingState(false);
    }
  }

  async function clearFavoriteWords() {
    await SecureStore.setItemAsync("favoriteWords", JSON.stringify([]));

    const accountId = await SecureStore.getItemAsync("accountId");

    if (accountId != null) {
      const idNum = parseInt(accountId);
      const apiURL = process.env.EXPO_PUBLIC_SERVER_API_URL;

      if (apiURL != undefined) {
        const deleteMessage = await deleteFavoriteWords(apiURL, idNum, favoriteWords);

        if (deleteMessage == "okay") {
        } else {
          Toast.show({
            type: "error",
            text1: deleteMessage,
            position: "top",
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Something went wrong with the API server endpoint.",
          position: "top",
        });
      }
    }

    DeviceEventEmitter.emit("favoriteWordsCleared");

    setFavoriteWords([]);
  }

  useFocusEffect(
    useCallback(() => {
      fetchFavoriteWords();
    }, [])
  );

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
        <Text style={{ color: Colors[theme].text }}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screenWrapper, { backgroundColor: Colors[theme].background }]}>
      <View
        style={{
          height: 60,
          backgroundColor: Colors.light.tint,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
          position: "relative",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>Favorites</Text>
        <Ionicons
          name="trash-bin"
          size={25}
          color="#fff"
          style={[styles.btnRemoveFavWords, { width: favoriteWords.length > 0 ? "auto" : 0 }]}
          onPress={clearFavoriteWords}
        />
      </View>
      {favoriteWords.length > 0 ? (
        <FlatList
          data={favoriteWords}
          renderItem={({ item }) => (
            <Link
              style={styles.wordItemWrapper}
              href={{ pathname: "/[word]", params: { word: item } }}
            >
              <Text style={[styles.wordItem, { color: Colors[theme].text }]}>{item}</Text>
            </Link>
          )}
        />
      ) : (
        <View style={styles.noWordWrapper}>
          <Text style={[styles.noWordHeadline, { color: Colors[theme].text }]}>
            There is no favorite words yet.
          </Text>
          <View style={styles.noWordDesc}>
            <Text style={{ color: Colors[theme].text }}>You can try to click the</Text>
            <Ionicons name="bookmark-outline" size={25} color={Colors.light.tint} />
            <Text style={[styles.noWordDescText2, { color: Colors[theme].text }]}>
              icon in the entry screen to mark your first favorite word
            </Text>
          </View>
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
  noWordWrapper: {
    flex: 1,
    gap: 16,
    padding: 16,
    justifyContent: "center",
  },
  screenWrapper: {
    flex: 1,
  },
  noWordHeadline: {
    textAlign: "center",
    fontSize: 18,
  },
  noWordDesc: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  noWordDescText2: {
    textAlign: "center",
  },
  btnRemoveFavWords: {
    position: "absolute",
    right: 16,
    top: "60%",
  },
});
