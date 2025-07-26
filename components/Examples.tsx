import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function Examples({ word }: { word: string }) {
  const [examples, setExamples] = useState([]) as any;
  const [loadingState, setLoadingState] = useState(false);

  async function fetchExamples() {
    setLoadingState(true);
    try {
      const apiURL = process.env.EXPO_PUBLIC_WORDNIK_API_URL;
      const apiKey = process.env.EXPO_PUBLIC_WORDNIK_API_KEY;

      if (apiURL && apiKey) {
        const response = await fetch(
          `${apiURL}/word.json/${word}/examples?api_key=${apiKey}`
        );
        const result = await response.json();

        if (result.examples && Array.isArray(result.examples)) {
          setExamples(result.examples);
        }
      }
    } catch (error: any) {
      console.log(error.message);
    }
    setLoadingState(false);
  }

  useEffect(() => {
    fetchExamples();
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
      <Text>Examples:</Text>
      <View>
        {examples.length > 0 ? (
          examples.map((example: any, idx: number) => (
            <View key={idx}>
              <Text>
                - "{example.text}" - {example.title}
              </Text>
            </View>
          ))
        ) : (
          <Text></Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingIconWrapper: {},
});
