import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  async function login() {
    setEmailError("");
    setPasswordError("");
    setIsSubmitting(true);

    const emailValue = email.trim();
    const passwordValue = password.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue == "") {
      setEmailError("Email value is empty. Please type it in.");
      setIsSubmitting(false);
      return;
    }

    if (emailValue.length > 30) {
      setEmailError("Your email is longer than 30 characters. Please try again.");
      setIsSubmitting(false);
      return;
    }

    if (!emailRegex.test(emailValue)) {
      setEmailError("Email value is not in the right format. Please try again.");
      setIsSubmitting(false);
      return;
    }

    if (passwordValue == "") {
      setPasswordError("Password value is empty. Please type it in");
      setIsSubmitting(false);
      return;
    }

    if (passwordValue.length > 20) {
      setPasswordError("Your password longer than 20 characters. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const apiURL = process.env.EXPO_PUBLIC_SERVER_API_URL;
    if (apiURL == undefined) {
      setLoginError(
        "There is something wrong when connecting to the server. Please try again later."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${apiURL}/api/login`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          email: emailValue,
          password: passwordValue,
        }),
      });
      const result = await response.json();

      if (result) {
        if (result.code == 200) {
          await SecureStore.setItemAsync("accountId", (result.data?.userId ?? 0).toString());
          setLoginError(result.message);

          setTimeout(() => {
            router.navigate("/(tabs)/settings");
          }, 2000);
        } else {
          setLoginError(result.message);
        }
      } else {
        setLoginError("Error while resolving account data. Please try again later.");
      }
    } catch (error: any) {
      setLoginError(error.message);
    } finally {
      setEmail("");
      setPassword("");
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.screenLayer} edges={["bottom"]}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        contentContainerStyle={[
          styles.screenWrapper,
          { backgroundColor: Colors[theme].background },
        ]}
      >
        <Text style={[styles.title, { color: Colors[theme].text }]}>Login</Text>
        <View>
          <View style={styles.inputWrapper}>
            <Text style={[styles.inputLabel, { color: Colors[theme].text }]}>Email</Text>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              maxLength={30}
              inputMode="email"
              style={[styles.input, { borderColor: Colors[theme].tint, color: Colors[theme].text }]}
              placeholderTextColor={Colors[theme].text}
            />
            <Text style={styles.errorMessage}>{emailError}</Text>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={[styles.inputLabel, { color: Colors[theme].text }]}>Password</Text>
            <TextInput
              placeholder="Password"
              value={password}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
              maxLength={20}
              style={[styles.input, { borderColor: Colors[theme].tint, color: Colors[theme].text }]}
              placeholderTextColor={Colors[theme].text}
            />
            <Text style={styles.errorMessage}>{passwordError}</Text>
          </View>
          <View style={styles.action}>
            <TouchableOpacity
              onPress={login}
              disabled={isSubmitting}
              style={[styles.btnSubmit, { backgroundColor: Colors.light.tint }]}
            >
              <Text style={[styles.btnSubmitText, { color: Colors.dark.text }]}>Log in</Text>
            </TouchableOpacity>
            <Text style={styles.errorMessage}>{loginError}</Text>
          </View>
        </View>
        <View>
          <Text style={[styles.endNote, { color: Colors[theme].text }]}>
            Have no account yet?{" "}
            <Link style={{ color: Colors.light.tint }} href={{ pathname: "/signup" }}>
              Sign up
            </Link>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    textAlign: "center",
  },
  inputWrapper: {
    gap: 8,
  },
  input: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  inputLabel: {
    fontWeight: 500,
  },
  btnSubmit: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
  },
  btnSubmitText: {
    textAlign: "center",
    fontWeight: 500,
    fontSize: 18,
  },
  endNote: {
    textAlign: "center",
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
  },
  action: {
    gap: 8,
  },
  screenLayer: {
    flex: 1,
  },
});
