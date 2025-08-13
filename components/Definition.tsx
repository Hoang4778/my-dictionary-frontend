import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useTheme } from "./ThemeContext";

export default function Definition({ word, styling = {} }: { word: string; styling: object }) {
  const [definitions, setDefinitions] = useState([]) as any;
  const [loadingState, setLoadingState] = useState(true);
  const { theme } = useTheme();

  async function fetchDefinition() {
    try {
      const apiURL = process.env.EXPO_PUBLIC_WORDNIK_API_URL;
      const apiKey = process.env.EXPO_PUBLIC_WORDNIK_API_KEY;

      if (apiURL && apiKey) {
        const response = await fetch(`${apiURL}/word.json/${word}/definitions?api_key=${apiKey}`);
        const result = await response.json();

        if (Array.isArray(result) && result.length > 0) {
          setDefinitions(result);
        }
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoadingState(false);
    }
  }

  useEffect(() => {
    fetchDefinition();
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
      <Text style={[styles.label, { color: Colors[theme].text }]}>Definitions:</Text>
      <View style={styles.itemWrapper}>
        {definitions.map((def: any, idx: number) => {
          if (def.partOfSpeech && def.text) {
            return (
              <View key={idx} style={styles.entryGroup}>
                <Text style={[styles.partOfSpeech, { color: Colors.light.tint }]}>
                  {def.partOfSpeech}
                </Text>
                <Text style={{ color: Colors[theme].text }}>
                  {def.text?.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "").trim()}
                </Text>
              </View>
            );
          }
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: 500,
  },
  itemWrapper: {
    gap: 16,
  },
  entryGroup: {
    gap: 4,
  },
  partOfSpeech: {
    fontSize: 24,
  },
});
