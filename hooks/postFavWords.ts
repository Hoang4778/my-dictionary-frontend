export async function postFavoriteWords(apiURL: string, userId: number, wordList: string[]) {
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
