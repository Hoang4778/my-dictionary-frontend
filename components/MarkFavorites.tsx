import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

export default function MarkFavorites({
  wordToMark,
  styling = {},
}: {
  wordToMark: string;
  styling?: object;
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  async function checkFavoriteWord() {
    const favoriteWordsStr = await SecureStore.getItemAsync("favoriteWords");

    if (favoriteWordsStr != null) {
      const favoriteWords = JSON.parse(favoriteWordsStr);

      if (Array.isArray(favoriteWords)) {
        const isThisWordFavorite = favoriteWords.includes(wordToMark);

        if (isThisWordFavorite == true) {
          setIsFavorite(true);
        }
      }
    }
  }

  async function markFavoriteWord() {
    try {
      const favoriteWordsStr = await SecureStore.getItemAsync("favoriteWords");

      if (favoriteWordsStr != null) {
        const favoriteWords = JSON.parse(favoriteWordsStr);

        if (Array.isArray(favoriteWords)) {
          const filteredFavoriteWords = favoriteWords.filter((word) => word != wordToMark);
          filteredFavoriteWords.unshift(wordToMark);
          const newFavoriteWordsStr = JSON.stringify(filteredFavoriteWords);
          await SecureStore.setItemAsync("favoriteWords", newFavoriteWordsStr);
        } else {
          const newFavoriteWords = [];
          newFavoriteWords.unshift(wordToMark);
          const newFavoriteWordsStr = JSON.stringify(newFavoriteWords);
          await SecureStore.setItemAsync("favoriteWords", newFavoriteWordsStr);
        }
      } else {
        const newFavoriteWords = [];
        newFavoriteWords.unshift(wordToMark);
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
          const favoriteWordIdx = favoriteWords.indexOf(wordToMark);

          if (favoriteWordIdx > -1) {
            favoriteWords.splice(favoriteWordIdx, 1);
            const newFavoriteWordsStr = JSON.stringify(favoriteWords);
            await SecureStore.setItemAsync("favoriteWords", newFavoriteWordsStr);
          } else {
            Toast.show({
              type: "error",
              text1: "Failed to save your favorite word. Please try again later",
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

  useEffect(() => {
    checkFavoriteWord();
  }, []);

  return (
    <View style={styling}>
      {isFavorite ? (
        <TouchableOpacity onPress={unmarkFavoriteWord}>
          <Ionicons name="bookmark" size={30} color={Colors.light.tint} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={markFavoriteWord}>
          <Ionicons name="bookmark-outline" size={30} color={Colors.light.tint} />
        </TouchableOpacity>
      )}
    </View>
  );
}
