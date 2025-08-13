import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useTheme } from "./ThemeContext";

export default function Examples({ word, styling = {} }: { word: string; styling: object }) {
  const [examples, setExamples] = useState([]) as any;
  const [loadingState, setLoadingState] = useState(true);
  const { theme } = useTheme();

  async function fetchExamples() {
    try {
      const apiURL = process.env.EXPO_PUBLIC_WORDNIK_API_URL;
      const apiKey = process.env.EXPO_PUBLIC_WORDNIK_API_KEY;

      if (apiURL && apiKey) {
        const response = await fetch(
          `${apiURL}/word.json/${word}/examples?api_key=${apiKey}&limit=5`
        );
        const result = await response.json();

        if (result.examples && Array.isArray(result.examples)) {
          setExamples(result.examples);
        }
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoadingState(false);
    }
  }

  useEffect(() => {
    fetchExamples();
  }, []);

  if (loadingState == true) {
    return (
      <View>
        <ActivityIndicator size="small" color={Colors.light.tint} />
      </View>
    );
  }

  return (
    <View style={styling}>
      <Text style={[styles.label, { color: Colors[theme].text }]}>Examples:</Text>
      <View style={styles.itemWrapper}>
        {examples.map((example: any, idx: number) => (
          <View key={idx}>
            <Text style={[styles.exampleText, { color: Colors[theme].text }]}>{example.text}</Text>
            <Text
              style={[
                styles.author,
                { color: theme == "dark" ? Colors.light.tint : Colors[theme].text },
              ]}
            >
              {example.title}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: 500,
  },
  author: {
    fontStyle: "italic",
    textAlign: "right",
    fontWeight: 500,
  },
  exampleText: {
    textAlign: "justify",
  },
  itemWrapper: {
    gap: 16,
  },
});
