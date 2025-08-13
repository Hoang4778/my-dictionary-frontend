import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountScreen() {
  const { id }: { id: string } = useLocalSearchParams();
  const [loadingState, setLoadingState] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountInfo, setAccountInfo] = useState({}) as any;
  const router = useRouter();
  const { theme } = useTheme();

  async function fetchAccountInfo() {
    const accountId = parseInt(id);

    if (accountId == undefined) {
      setErrorMessage("Account ID number is not found. Please try again later.");
      setLoadingState(false);
      return;
    } else if (accountId == 0) {
      setErrorMessage("Wrong account ID number. Please try again later.");
      setLoadingState(false);
      return;
    }

    const apiURL = process.env.EXPO_PUBLIC_SERVER_API_URL;
    if (apiURL == undefined) {
      setErrorMessage(
        "There is something wrong when connecting to the server. Please try again later."
      );
      return;
    }

    try {
      const endpoint = new URL(`${apiURL}/api/account/get`);
      endpoint.searchParams.append("accountId", id);

      const response = await fetch(endpoint);
      const result = await response.json();

      setAccountInfo(result);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoadingState(false);
    }
  }

  async function handleLogout() {
    await SecureStore.deleteItemAsync("accountId");

    router.navigate("/(tabs)/settings");
  }

  function logout() {
    Alert.alert("Signing out", "Are you sure you want to sign out?", [
      {
        text: "Yes",
        onPress: handleLogout,
      },
      {
        text: "No",
      },
    ]);
  }

  useEffect(() => {
    fetchAccountInfo();
  }, []);

  if (loadingState == true) {
    return (
      <View style={[styles.loadingIconWrapper, { backgroundColor: Colors[theme].background }]}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  if (errorMessage != "") {
    return (
      <View style={[styles.errorWrapper, { backgroundColor: Colors[theme].background }]}>
        <Text style={{ textAlign: "center", color: Colors[theme].text }}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.screenWrapper, { backgroundColor: Colors[theme].background }]}
      edges={["bottom"]}
    >
      <View>
        <View style={styles.infoItem}>
          <Text style={[styles.textItem, { color: Colors[theme].text }]}>Account name:</Text>
          <Text style={{ color: Colors[theme].text }}>{accountInfo.data?.name}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={[styles.textItem, { color: Colors[theme].text }]}>Account email:</Text>
          <Text style={{ color: Colors[theme].text }}>{accountInfo.data?.email}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={logout}
        style={[styles.btnLogout, { borderColor: Colors.light.tint }]}
      >
        <Text style={[styles.btnLogoutText, { color: Colors.light.tint }]}>Log out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingIconWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  screenWrapper: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  infoItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#cdcdcdff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnLogout: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    width: "100%",
  },
  btnLogoutText: {
    textAlign: "center",
    fontWeight: 500,
    fontSize: 18,
  },
  textItem: {
    fontSize: 18,
  },
});
