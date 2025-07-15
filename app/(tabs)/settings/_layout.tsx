import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function WordOfTheDayLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => (
          <View
            style={{
              height: 60,
              backgroundColor: Colors.light.tint,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
              Settings
            </Text>
          </View>
        ),
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
