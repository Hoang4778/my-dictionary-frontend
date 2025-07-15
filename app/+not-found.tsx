import { Colors } from "@/constants/Colors";
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.announcement}>This screen does not exist</Text>
        <Text>
          Go back to{" "}
          <Link href="/" style={styles.link}>
            home screen
          </Link>
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 8,
  },
  announcement: {
    fontSize: 24,
    textAlign: "center",
  },
  link: {
    textAlign: "center",
    color: Colors.light.tint,
  },
});
