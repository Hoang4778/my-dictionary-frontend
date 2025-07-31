import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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
      setEmailError(
        "Your email is longer than 30 characters. Please try again."
      );
      setIsSubmitting(false);
      return;
    }

    if (!emailRegex.test(emailValue)) {
      setEmailError(
        "Email value is not in the right format. Please try again."
      );
      setIsSubmitting(false);
      return;
    }

    if (passwordValue == "") {
      setPasswordError("Password value is empty. Please type it in");
      setIsSubmitting(false);
      return;
    }

    if (passwordValue.length > 20) {
      setPasswordError(
        "Your password longer than 20 characters. Please try again."
      );
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
        method: "POST",
        body: JSON.stringify({
          email: emailValue,
          password: passwordValue,
        }),
      });
      const result = await response.json();

      if (result) {
        if (result.code == 200) {
          await SecureStore.setItemAsync("accountId", result.userId ?? 0);
          setLoginError(result.message);

          setTimeout(() => {
            router.navigate("/(tabs)/settings");
          }, 2000);
        } else {
          setLoginError(result.message);
        }
      } else {
        setLoginError(
          "Error while resolving account data. Please try again later."
        );
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
    <View>
      <View>
        <Text>Login</Text>
        <View>
          <View>
            <Text>Email</Text>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              maxLength={30}
              inputMode="email"
            />
            <Text>{emailError}</Text>
          </View>
          <View>
            <Text>Password</Text>
            <TextInput
              placeholder="Password"
              value={password}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
              maxLength={20}
            />
            <Text>{passwordError}</Text>
          </View>
          <View>
            <TouchableOpacity onPress={login} disabled={isSubmitting}>
              <Text>Log in</Text>
            </TouchableOpacity>
            <Text>{loginError}</Text>
          </View>
        </View>
        <View>
          <Text>
            Have no account yet?{" "}
            <Link href={{ pathname: "/signup" }}>Sign up</Link>
          </Text>
        </View>
      </View>
    </View>
  );
}
