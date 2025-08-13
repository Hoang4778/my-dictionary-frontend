import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import wordList from "../../../assets/words/word-list.json";

export default function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clearSearch, setClearSearch] = useState(false);
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();

  const filteredWords = useMemo(() => {
    return wordList.filter((word) => word.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, wordList]);

  function handleSearchTerm() {
    if (searchTerm != "") {
      setClearSearch(true);
    }
  }

  function handleSearchInput(searchText: string) {
    if (searchText != "") {
      setClearSearch(true);
      setSearchTerm(searchText);
    } else {
      setClearSearch(false);
      setSearchTerm(searchText);
    }
  }

  function handleClearSearch() {
    setSearchTerm("");
    setClearSearch(false);
  }

  return (
    <SafeAreaView style={[styles.screenWrapper, { backgroundColor: Colors[theme].background }]}>
      <View style={styles.stackBar}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={28} color={Colors.light.icon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchTerm}
            onChangeText={(text) => handleSearchInput(text)}
            onFocus={handleSearchTerm}
          />
          <Ionicons
            name="close-circle"
            size={20}
            color="gray"
            style={{ opacity: clearSearch ? 1 : 0 }}
            onPress={handleClearSearch}
          />
        </View>
      </View>
      <FlatList
        style={styles.wordListWrapper}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
        data={filteredWords}
        renderItem={({ item }) => (
          <Link
            style={styles.wordItemWrapper}
            href={{ pathname: "/[word]", params: { word: item } }}
          >
            <Text style={[styles.wordItem, { color: Colors[theme].text }]}>{item}</Text>
          </Link>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
  },
  wordListWrapper: {
    flex: 1,
  },
  wordItemWrapper: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#cdcdcdff",
  },
  wordItem: {
    fontSize: 18,
  },
  stackBar: {
    height: "auto",
    backgroundColor: Colors.light.tint,
    padding: 16,
  },
  searchBar: {
    backgroundColor: "white",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    position: "relative",
  },
  searchInput: {
    padding: 8,
    fontSize: 18,
    height: "100%",
    width: "85%",
  },
});
