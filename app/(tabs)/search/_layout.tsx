import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

export default function SearchLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => (
          <View style={styles.stackBar}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={28} color={Colors.light.icon} />
              <TextInput style={styles.searchInput} placeholder="Search" />
            </View>
          </View>
        ),
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}

const styles = StyleSheet.create({
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
  },
  searchInput: {
    padding: 8,
    fontSize: 18,
    width: "100%",
    height: "100%",
  },
});
