import { Link } from "expo-router";
import { FlatList, StyleSheet, Text } from "react-native";
import wordList from "../../../assets/words/word-list.json";

export default function SearchScreen() {
  return (
    <>
      <FlatList
        data={wordList}
        renderItem={({ item }) => (
          <Link
            style={styles.wordItemWrapper}
            href={{ pathname: "/[word]", params: { word: item } }}
          >
            <Text style={styles.wordItem}>{item}</Text>
          </Link>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  wordItemWrapper: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#cdcdcdff",
  },
  wordItem: {
    fontSize: 18,
  },
});
