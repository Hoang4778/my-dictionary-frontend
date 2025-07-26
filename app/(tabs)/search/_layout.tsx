import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function SearchLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}

const styles = StyleSheet.create({});
