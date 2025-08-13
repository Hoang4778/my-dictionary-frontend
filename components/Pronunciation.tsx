import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAudioPlayer } from "expo-audio";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Pronunciation({ word }: { word: string }) {
  const [loadingState, setLoadingState] = useState(false);
  const [audioSource, setAudioSource] = useState("");
  const player = useAudioPlayer(audioSource);

  async function fetchPronunciation() {
    setLoadingState(true);
    try {
      const apiURL = process.env.EXPO_PUBLIC_WORDNIK_API_URL;
      const apiKey = process.env.EXPO_PUBLIC_WORDNIK_API_KEY;

      if (apiURL && apiKey) {
        const response = await fetch(`${apiURL}/word.json/${word}/audio?api_key=${apiKey}`);
        const result = await response.json();

        if (Array.isArray(result) && result.length > 0) {
          setAudioSource(result[0].fileUrl);
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
      <View>
        <ActivityIndicator size="small" color={Colors.light.tint} />
      </View>
    );
  }

  return (
    <View>
      {audioSource != "" ? (
        <Ionicons
          name="volume-high"
          size={20}
          color={Colors.light.tint}
          onPress={() => {
            player.seekTo(0);
            player.play();
          }}
        />
      ) : (
        <Ionicons name="volume-mute" size={20} color={Colors.light.tint} />
      )}
    </View>
  );
}
