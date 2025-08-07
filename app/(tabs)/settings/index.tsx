import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountId, setAccountId] = useState(0);

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
    getLoginInfo();
  }, []);

  return (
    <View>
      <Link href={{ pathname: "/aboutUs" }}>
        <Text>About us</Text>
      </Link>
      <View style={{ backgroundColor: Colors[theme].background }}>
        <Text style={{ color: Colors[theme].text }}>
          Switch to {theme == "dark" ? "light" : "dark"} mode
        </Text>
        <Button title="Toggle" onPress={toggleTheme} />
      </View>
      {isLoggedIn ? (
        <Link
          href={{
            pathname: "/account/[id]",
            params: { id: accountId },
          }}
        >
          <Text>Account</Text>
        </Link>
      ) : (
        <Link href={{ pathname: "/login" }}>
          <Text>Log in</Text>
        </Link>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
