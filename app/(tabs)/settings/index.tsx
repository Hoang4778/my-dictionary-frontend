import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { syncFavoriteWords } from "@/hooks/syncFavWords";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountId, setAccountId] = useState(0);
  const platform = Platform.OS;

  async function getLoginInfo() {
    try {
      const accountId = await SecureStore.getItemAsync("accountId");

      if (accountId != null) {
        const id = parseInt(accountId);

        if (id != undefined) {
          setAccountId(id);
          setIsLoggedIn(true);
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

  useEffect(() => {
    getLoginInfo().then(() => syncFavoriteWords());
  }, []);

  return (
    <View style={[styles.screenWrapper, { backgroundColor: Colors[theme].background }]}>
      <Link href={{ pathname: "/aboutUs" }} asChild>
        <Pressable style={styles.aboutUs}>
          <Text style={[styles.textItem, { color: Colors[theme].text }]}>About us</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors[theme].icon} />
        </Pressable>
      </Link>
      <View style={[styles.darkmode, { paddingVertical: platform == "android" ? 4 : 8 }]}>
        <Text style={[styles.textItem, { color: Colors[theme].text }]}>
          Switch to {theme == "dark" ? "light" : "dark"} mode
        </Text>
        <Switch
          value={theme == "dark" ? true : false}
          onValueChange={toggleTheme}
          trackColor={{ false: Colors.light.tint, true: Colors.dark.tint }}
          ios_backgroundColor={Colors.light.tint}
          thumbColor="lightgray"
        />
      </View>
      {isLoggedIn ? (
        <Link
          href={{
            pathname: "/account/[id]",
            params: { id: accountId },
          }}
          asChild
        >
          <Pressable style={styles.loginLink}>
            <Text style={[styles.textItem, { color: Colors[theme].text }]}>Account</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors[theme].icon} />
          </Pressable>
        </Link>
      ) : (
        <Link href={{ pathname: "/login" }} asChild>
          <Pressable style={styles.loginLink}>
            <Text style={[styles.textItem, { color: Colors[theme].text }]}>Log in</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors[theme].icon} />
          </Pressable>
        </Link>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
  },
  aboutUs: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#cdcdcdff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  darkmode: {
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#cdcdcdff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  loginLink: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#cdcdcdff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    fontSize: 18,
  },
});
