import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <View>
      <Link href={{ pathname: "/aboutUs" }}>
        <Text>About us</Text>
      </Link>
      <View style={{ backgroundColor: Colors[theme].background }}>
        <Text style={{ color: Colors[theme].text }}>Switch to dark mode</Text>
        <Button title="Toggle" onPress={toggleTheme} />
      </View>
      <Text>Upgrade</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
