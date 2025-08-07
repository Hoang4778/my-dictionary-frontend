import { Colors } from "@/constants/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AccountScreen() {
  const { id }: { id: string } = useLocalSearchParams();
  const [loadingState, setLoadingState] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountInfo, setAccountInfo] = useState({}) as any;
  const router = useRouter();

  async function fetchAccountInfo() {
    setLoadingState(true);

    const accountId = parseInt(id);

    if (accountId == undefined) {
      setErrorMessage(
        "Account ID number is not found. Please try again later."
      );
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
      <View style={styles.loadingIconWrapper}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  if (errorMessage != "") {
    return (
      <View style={styles.errorWrapper}>
        <Text style={{ textAlign: "center" }}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Account name: {accountInfo.data?.name}</Text>
      <Text>Account email: {accountInfo.data?.email}</Text>
      <TouchableOpacity onPress={logout}>
        <Text>Log out</Text>
      </TouchableOpacity>
    </View>
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
});
