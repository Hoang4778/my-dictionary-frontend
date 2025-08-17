import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useMemo, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import wordList from "../../../assets/words/word-list.json";

export default function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clearSearch, setClearSearch] = useState(false);
  const [recentWordList, setRecentWordList] = useState<any[]>([]);
  const [showRecentWords, setShowRecentWords] = useState(true);
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
    const searchStr = searchText.trim();

    if (searchStr != "") {
      setShowRecentWords(false);
      setSearchTerm(searchStr);
      setClearSearch(true);
    } else {
      setShowRecentWords(true);
      setSearchTerm("");
      setClearSearch(false);
    }
  }

  function handleClearSearch() {
    setShowRecentWords(true);
    setSearchTerm("");
    setClearSearch(false);
  }

  async function getRecentWords() {
    try {
      const recentWordStr = await SecureStore.getItemAsync("recentWords");

      if (recentWordStr != null) {
        const recentWords = JSON.parse(recentWordStr);

        if (Array.isArray(recentWords)) {
          setRecentWordList(recentWords);
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

  async function clearRecentWords() {
    try {
      await SecureStore.setItemAsync("recentWords", JSON.stringify([]));
      setRecentWordList([]);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message,
        position: "top",
      });
    }
  }

  useFocusEffect(
    useCallback(() => {
      getRecentWords();
    }, [])
  );

  return (
    <SafeAreaView style={[styles.screenWrapper, { backgroundColor: Colors[theme].background }]}>
      <View style={styles.stackBar}>
        <View style={[styles.searchBar, { width: recentWordList.length > 0 ? "92%" : "100%" }]}>
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
        <Ionicons
          name="trash-bin"
          size={25}
          color="#fff"
          style={{ display: recentWordList.length > 0 ? "flex" : "none" }}
          onPress={clearRecentWords}
        />
      </View>
      {showRecentWords ? (
        <FlatList
          style={styles.wordListWrapper}
          contentContainerStyle={{ paddingBottom: tabBarHeight }}
          data={recentWordList}
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
      )}
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
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  searchBar: {
    backgroundColor: "white",
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
