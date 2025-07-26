import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function Phonetic({ word }: { word: string }) {
  const [phonetic, setPhonetic] = useState({}) as any;
  const [loadingState, setLoadingState] = useState(false);

  async function fetchPhonetic() {
    setLoadingState(true);
    try {
      const apiURL = process.env.EXPO_PUBLIC_WORDNIK_API_URL;
      const apiKey = process.env.EXPO_PUBLIC_WORDNIK_API_KEY;

      if (apiURL && apiKey) {
        const response = await fetch(
          `${apiURL}/word.json/${word}/pronunciations?api_key=${apiKey}`
        );
        const result = await response.json();

        if (Array.isArray(result) && result.length > 0) {
          setPhonetic(result[0]);
        }
      }
    } catch (error: any) {
      console.log(error.message);
    }
    setLoadingState(false);
  }

  useEffect(() => {
    fetchPhonetic();
  }, []);

  if (loadingState == true) {
    return (
      <View style={styles.loadingIconWrapper}>
        <ActivityIndicator size="small" color={Colors.light.tint} />
      </View>
    );
  }

  return (
    <View>
      {Object.keys(phonetic).length > 0 && phonetic.raw ? (
        <Text>/{phonetic.raw?.replaceAll("/", "")}/</Text>
      ) : (
        <Text></Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingIconWrapper: {},
});
