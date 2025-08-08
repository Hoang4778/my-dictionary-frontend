import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

function findWordsNotFrom(endList: string[], startList: string[]) {
  return startList.filter((word) => !endList.includes(word));
}

async function postFavoriteWords(
  apiURL: string,
  userId: number,
  wordList: string[]
) {
  const addResponse = await fetch(`${apiURL}/api/favorite-words/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      favoriteWords: wordList,
    }),
  });
  const addResult = await addResponse.json();

  if (addResult.code == 200) {
    return "okay";
  } else {
    return addResult.message;
  }
}

async function deleteFavoriteWords(
  apiURL: string,
  userId: number,
  wordList: string[]
) {
  const deleteResponse = await fetch(`${apiURL}/api/favorite-words/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      favoriteWords: wordList,
    }),
  });
  const deleteResult = await deleteResponse.json();

  if (deleteResult.code == 200) {
    return "okay";
  } else {
    return deleteResult.message;
  }
}

export default function HomeScreen() {
  const [isReadyForRedirect, setIsReadyForRedirect] = useState(false);

  async function syncFavoriteWords() {
    try {
      const accountId = await SecureStore.getItemAsync("accountId");
      const idNum = parseInt(accountId);

      if (!Number.isNaN(idNum)) {
        const favoriteWordsStr = await SecureStore.getItemAsync(
          "favoriteWords"
        );
        const favoriteWords = JSON.parse(favoriteWordsStr);

        const apiURL = process.env.EXPO_PUBLIC_SERVER_API_URL;

        if (apiURL != undefined) {
          const endpoint = new URL(`${apiURL}/api/favorite-words/get`);
          endpoint.searchParams.append("userId", idNum.toString());

          const response = await fetch(endpoint);
          const result = await response.json();

          if (result.code == 200) {
            const fetchedWords = result.data?.map((word) => word.entry);

            if (Array.isArray(favoriteWords)) {
              const wordsToAdd = findWordsNotFrom(fetchedWords, favoriteWords);
              const wordsToDelete = findWordsNotFrom(
                favoriteWords,
                fetchedWords
              );

              if (wordsToDelete.length > 0) {
                const deleteMessage = await deleteFavoriteWords(
                  apiURL,
                  idNum,
                  wordsToDelete
                );

                if (deleteMessage == "okay") {
                  if (wordsToAdd.length > 0) {
                    const addMessage = await postFavoriteWords(
                      apiURL,
                      idNum,
                      wordsToAdd
                    );

                    if (addMessage == "okay") {
                      Toast.show({
                        type: "success",
                        text1:
                          "Successfully synced favorite words to your account.",
                        position: "top",
                      });
                    } else {
                      Toast.show({
                        type: "error",
                        text1: addMessage,
                        position: "top",
                      });
                    }
                  } else {
                    Toast.show({
                      type: "success",
                      text1:
                        "Successfully synced favorite words to your account.",
                      position: "top",
                    });
                  }
                } else {
                  Toast.show({
                    type: "error",
                    text1: deleteMessage,
                    position: "top",
                  });
                }
              } else {
                if (wordsToAdd.length > 0) {
                  const addMessage = await postFavoriteWords(
                    apiURL,
                    idNum,
                    wordsToAdd
                  );

                  if (addMessage == "okay") {
                    Toast.show({
                      type: "success",
                      text1:
                        "Successfully synced favorite words to your account.",
                      position: "top",
                    });
                  } else {
                    Toast.show({
                      type: "error",
                      text1: addMessage,
                      position: "top",
                    });
                  }
                } else {
                  Toast.show({
                    type: "success",
                    text1:
                      "Successfully synced favorite words to your account.",
                    position: "top",
                  });
                }
              }
            } else {
              await SecureStore.setItemAsync(
                "favoriteWords",
                JSON.stringify(result.data)
              );

              Toast.show({
                type: "success",
                text1: "Successfully synced favorite words to your account.",
                position: "top",
              });
            }
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
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message,
        position: "top",
      });
    } finally {
      setIsReadyForRedirect(true);
    }
  }

  useEffect(() => {
    syncFavoriteWords();
    // const syncTask = InteractionManager.runAfterInteractions(() => {
    // });

    // return syncTask.cancel();
  }, []);

  if (isReadyForRedirect) {
    return <Redirect href="/(tabs)/search" />;
  }

  return null;
}
