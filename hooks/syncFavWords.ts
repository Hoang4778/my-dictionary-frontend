import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import { postFavoriteWords } from "./postFavWords";

function findWordsNotFrom(endList: string[], startList: string[]) {
  return startList.filter((word) => !endList.includes(word));
}

export async function syncFavoriteWords() {
  try {
    const accountId = await SecureStore.getItemAsync("accountId");

    if (accountId != null) {
      const idNum = parseInt(accountId);

      if (!Number.isNaN(idNum)) {
        const apiURL = process.env.EXPO_PUBLIC_SERVER_API_URL;

        if (apiURL != undefined) {
          const endpoint = new URL(`${apiURL}/api/favorite-words/get`);
          endpoint.searchParams.append("userId", idNum.toString());

          const response = await fetch(endpoint);
          const result = await response.json();

          if (result.code == 200) {
            const fetchedWords = result.data?.map((word: any) => word.entry);

            const localFavoriteWordStr = await SecureStore.getItemAsync("favoriteWords");

            if (localFavoriteWordStr != null) {
              const rawLocalFavWords = JSON.parse(localFavoriteWordStr);

              if (Array.isArray(rawLocalFavWords)) {
                const localFavoriteWords = rawLocalFavWords.filter(
                  (word) => typeof word === "string"
                );
                const combinedFavoriteWords = new Set([...localFavoriteWords, ...fetchedWords]);
                const newFavoriteWords = Array.from(combinedFavoriteWords);
                await SecureStore.setItemAsync("favoriteWords", JSON.stringify(newFavoriteWords));

                const localDiffWords = findWordsNotFrom(fetchedWords, localFavoriteWords);

                if (localDiffWords.length > 0) {
                  const addMessage = await postFavoriteWords(apiURL, idNum, localDiffWords);

                  if (addMessage == "okay") {
                  } else {
                    Toast.show({
                      type: "error",
                      text1: addMessage,
                      position: "top",
                    });
                  }
                }
              } else {
                await SecureStore.setItemAsync("favoriteWords", JSON.stringify(fetchedWords));
              }
            }

            Toast.show({
              type: "success",
              text1: "Successfully synced favorite words to your account.",
              position: "top",
            });
          } else {
            Toast.show({
              type: "error",
              text1: result.message,
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
      } else {
        Toast.show({
          type: "error",
          text1: "Something went wrong with your account ID.",
          position: "top",
        });
      }
    }
  } catch (error: any) {
    Toast.show({
      type: "error",
      text1: error.message,
      position: "top",
    });
  }
}
