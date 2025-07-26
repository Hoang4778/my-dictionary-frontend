import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function Pronunciation({ word }: { word: string }) {
  const [pronunciation, setPronunciation] = useState({}) as any;
  const [loadingState, setLoadingState] = useState(false);

  async function fetchPronunciation() {
    setLoadingState(true);
    try {
      const apiURL = process.env.EXPO_PUBLIC_WORDNIK_API_URL;
      const apiKey = process.env.EXPO_PUBLIC_WORDNIK_API_KEY;

      if (apiURL && apiKey) {
        const response = await fetch(
          `${apiURL}/word.json/${word}/audio?api_key=${apiKey}`
        );
        const result = await response.json();

        if (Array.isArray(result) && result.length > 0) {
          setPronunciation(result[0]);
        }
      }
    } catch (error: any) {
      console.log(error.message);
    }
    setLoadingState(false);
  }

  useEffect(() => {
    fetchPronunciation();
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
      {Object.keys(pronunciation).length > 0 && pronunciation.fileUrl ? (
        <Text>Pronunciation: {pronunciation.fileUrl}</Text>
      ) : (
        <Text></Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingIconWrapper: {},
});
