import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutUs() {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.screenWrapper, { backgroundColor: Colors[theme].background }]}
      edges={["bottom"]}
    >
      <Text style={[styles.title, { color: Colors[theme].text }]}>My dictionary</Text>
      <Text style={{ color: Colors[theme].text }}>Knowledge without boundaries</Text>
      <Text style={[styles.version, { color: Colors[theme].text }]}>Version 1.0.0</Text>
      <Text style={{ color: Colors[theme].text }}>Copyright © 2023 My Dictionary Team</Text>
      <Text style={[styles.copyright2, { color: Colors[theme].text }]}>All rights reserved</Text>
      <Text style={{ color: Colors[theme].text }}>
        Contact us at: <Text style={{ color: Colors.light.tint }}>support@mydictionary.com</Text>
      </Text>
      <Text style={{ color: Colors[theme].text }}>Follow us on social media for updates</Text>
      <Text>
        <Text style={{ color: Colors.light.tint }}>Privacy Policy</Text> |{" "}
        <Text style={{ color: Colors.light.tint }}>Terms of Service</Text>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textTransform: "uppercase",
    fontSize: 18,
    fontWeight: 500,
  },
  version: {
    fontWeight: 300,
    marginBottom: 16,
  },
  copyright2: {
    marginBottom: 16,
  },
});
