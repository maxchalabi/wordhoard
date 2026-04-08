import * as Speech from 'expo-speech';
import { LanguageConfig } from './languages';

export function speakWord(text: string, language: LanguageConfig): void {
  Speech.stop();
  Speech.speak(text, {
    language: language.ttsCode,
    rate: language.ttsRate,
    onError: (error) => {
      console.warn(`TTS failed for ${language.ttsCode}:`, error);
    },
  });
}

export function stopSpeaking(): void {
  Speech.stop();
}
