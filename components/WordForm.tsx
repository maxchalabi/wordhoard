import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useColors from './useColors';
import { speakWord } from '@/lib/speech';
import { generatePronunciation } from '@/lib/pronunciation';
import { LanguageConfig } from '@/lib/languages';

type Props = {
  language: LanguageConfig;
  wordText: string;
  onWordTextChange: (text: string) => void;
  translation: string;
  onTranslationChange: (text: string) => void;
  pronunciation: string;
  onPronunciationChange: (text: string) => void;
};

export default function WordForm({
  language,
  wordText,
  onWordTextChange,
  translation,
  onTranslationChange,
  pronunciation,
  onPronunciationChange,
}: Props) {
  const colors = useColors();

  const handleWordChange = (text: string) => {
    onWordTextChange(text);
    if (text.trim() && language.hasPronunciationGuide) {
      onPronunciationChange(generatePronunciation(text.trim(), language.code));
    } else {
      onPronunciationChange('');
    }
  };

  return (
    <>
      <Text style={[styles.label, { color: colors.subtitle }]}>
        {language.nativeName}
      </Text>
      <TextInput
        style={[
          styles.input,
          styles.wordInput,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        value={wordText}
        onChangeText={handleWordChange}
        placeholder={language.placeholder}
        placeholderTextColor={colors.pinyin}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        inputMode="text"
      />

      {language.hasPronunciationGuide && pronunciation ? (
        <View style={styles.pronunciationRow}>
          <Text style={[styles.pronunciationLabel, { color: colors.subtitle }]}>
            {language.pronunciationLabel}
          </Text>
          <View style={styles.pronunciationContent}>
            <TextInput
              style={[styles.pronunciationInput, { color: colors.pinyin }]}
              value={pronunciation}
              onChangeText={onPronunciationChange}
              placeholder={`Edit ${language.pronunciationLabel.toLowerCase()}...`}
              placeholderTextColor={colors.border}
            />
            <TouchableOpacity
              onPress={() => speakWord(wordText.trim(), language)}
              style={styles.speakButton}
              activeOpacity={0.6}
            >
              <FontAwesome name="volume-up" size={18} color={colors.tint} />
            </TouchableOpacity>
          </View>
        </View>
      ) : wordText.trim() ? (
        <View style={styles.pronunciationRow}>
          <TouchableOpacity
            onPress={() => speakWord(wordText.trim(), language)}
            style={styles.speakButton}
            activeOpacity={0.6}
          >
            <FontAwesome name="volume-up" size={18} color={colors.tint} />
          </TouchableOpacity>
        </View>
      ) : null}

      <Text style={[styles.label, { color: colors.subtitle }]}>
        Translation
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        value={translation}
        onChangeText={onTranslationChange}
        placeholder="Enter translation..."
        placeholderTextColor={colors.pinyin}
        autoCapitalize="sentences"
        autoCorrect={true}
        inputMode="text"
      />
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  wordInput: {
    fontSize: 24,
    paddingVertical: 16,
  },
  pronunciationRow: {
    marginTop: 10,
    paddingHorizontal: 4,
  },
  pronunciationLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  pronunciationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pronunciationInput: {
    flex: 1,
    fontSize: 14,
    letterSpacing: 0.3,
    paddingVertical: 4,
  },
  speakButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
