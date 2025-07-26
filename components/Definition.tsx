import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function Definition({ word }: { word: string }) {
  const [definitions, setDefinitions] = useState([]) as any;
  const [loadingState, setLoadingState] = useState(false);

  async function fetchDefinition() {
    setLoadingState(true);
    try {
      const apiURL = process.env.EXPO_PUBLIC_WORDNIK_API_URL;
      const apiKey = process.env.EXPO_PUBLIC_WORDNIK_API_KEY;

      if (apiURL && apiKey) {
        const response = await fetch(
          `${apiURL}/word.json/${word}/definitions?api_key=${apiKey}`
        );
        const result = await response.json();

        if (Array.isArray(result) && result.length > 0) {
          setDefinitions(result);
        }
      }
    } catch (error: any) {
      console.log(error.message);
    }
    setLoadingState(false);
  }

  useEffect(() => {
    fetchDefinition();
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
      <Text>Definitions:</Text>
      <View>
        {definitions.length > 0 ? (
          definitions.map((def: any, idx: number) => (
            <View key={idx}>
              {def.text && def.partOfSpeech ? (
                <Text>
                  - {def.partOfSpeech}:{" "}
                  {def.text?.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "")}
                </Text>
              ) : (
                <Text></Text>
              )}
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
