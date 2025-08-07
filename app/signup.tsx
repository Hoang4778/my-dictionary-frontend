import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignupScreen() {
  const [accountName, setAccountName] = useState("");
  const [accountNameError, setAccountNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function signup() {
    setAccountNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setIsSubmitting(true);

    const accountNameValue = accountName.trim();
    const emailValue = email.trim();
    const passwordValue = password.trim();
    const confirmPasswordValue = confirmPassword.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (accountNameValue == "") {
      setAccountNameError("Account name value is empty. Please type it in.");
      setIsSubmitting(false);
      return;
    }

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

    if (confirmPasswordValue == "") {
      setConfirmPasswordError(
        "Password confirm value is empty. Please type it in."
      );
      setIsSubmitting(false);
      return;
    }

    if (confirmPasswordValue != passwordValue) {
      setConfirmPasswordError(
        "Your password confirm value is not the same as your password value. Please try again."
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
      const response = await fetch(`${apiURL}/api/signup`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          userName: accountNameValue,
          email: emailValue,
          password: passwordValue,
        }),
      });
      const result = await response.json();

      if (result) {
        if (result.code == 200) {
          await SecureStore.setItemAsync(
            "accountId",
            (result.data?.userId ?? 0).toString()
          );
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
      setAccountName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setIsSubmitting(false);
    }
  }

  return (
    <View>
      <View>
        <Text>Login</Text>
        <View>
          <View>
            <Text>Account name:</Text>
            <TextInput
              placeholder="Name"
              value={accountName}
              onChangeText={(text) => setAccountName(text)}
              maxLength={20}
            />
            <Text>{accountNameError}</Text>
          </View>
          <View>
            <Text>Email:</Text>
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
            <Text>Password:</Text>
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
            <Text>Confirm password:</Text>
            <TextInput
              placeholder="Confirm password"
              value={confirmPassword}
              secureTextEntry={true}
              onChangeText={(text) => setConfirmPassword(text)}
              maxLength={20}
            />
            <Text>{confirmPasswordError}</Text>
          </View>
          <View>
            <TouchableOpacity onPress={signup} disabled={isSubmitting}>
              <Text>Sign up</Text>
            </TouchableOpacity>
            <Text>{loginError}</Text>
          </View>
        </View>
        <View>
          <Text>
            Already have an account?{" "}
            <Link href={{ pathname: "/login" }}>Log in</Link>
          </Text>
        </View>
      </View>
    </View>
  );
}
