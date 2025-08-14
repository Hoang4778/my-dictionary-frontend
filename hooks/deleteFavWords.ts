export async function deleteFavoriteWords(apiURL: string, userId: number, wordList: string[]) {
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
