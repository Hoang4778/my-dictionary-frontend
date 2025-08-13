import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useTheme } from "./ThemeContext";

export default function Phonetic({ word }: { word: string }) {
  const [phonetic, setPhonetic] = useState("");
  const [loadingState, setLoadingState] = useState(true);
  const { theme } = useTheme();

  async function fetchPhonetic() {
    try {
      const apiURL = process.env.EXPO_PUBLIC_WORDNIK_API_URL;
      const apiKey = process.env.EXPO_PUBLIC_WORDNIK_API_KEY;

      if (apiURL && apiKey) {
        const response = await fetch(
          `${apiURL}/word.json/${word}/pronunciations?api_key=${apiKey}`
        );
        const result = await response.json();

        if (Array.isArray(result) && result.length > 0) {
          setPhonetic(result[0]?.raw);
        }
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoadingState(false);
    }
  }

  useEffect(() => {
    fetchPhonetic();
  }, []);

  if (loadingState == true) {
    return (
      <View>
        <ActivityIndicator size="small" color={Colors.light.tint} />
      </View>
    );
  }

  if (phonetic == "") {
    return null;
  }

  return (
    <View>
      <Text style={{ color: Colors[theme].text }}>/{phonetic.replaceAll("/", "")}/</Text>
    </View>
  );
}
