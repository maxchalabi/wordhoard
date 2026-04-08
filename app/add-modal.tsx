import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useColors from '@/components/useColors';
import useLanguage from '@/components/useLanguage';
import WordForm from '@/components/WordForm';
import { insertWord } from '@/lib/database';
import { generatePronunciation } from '@/lib/pronunciation';

export default function AddModal() {
  const [wordText, setWordText] = useState('');
  const [translation, setTranslation] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const colors = useColors();
  const { language, refresh } = useLanguage();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleSave = async () => {
    if (!language) return;
    const trimmedWord = wordText.trim();
    const trimmedTranslation = translation.trim();

    if (!trimmedWord || !trimmedTranslation) {
      Alert.alert('Missing fields', `Please enter both ${language.nativeName} and translation.`);
      return;
    }

    const finalPronunciation = language.hasPronunciationGuide
      ? pronunciation || generatePronunciation(trimmedWord, language.code)
      : '';
    await insertWord(language.code, trimmedWord, trimmedTranslation, finalPronunciation);
    setWordText('');
    setTranslation('');
    setPronunciation('');
    Alert.alert('Saved!', `"${trimmedWord}" added to your ${language.name} library.`, [
      { text: 'Add Another', style: 'default' },
      { text: 'Done', style: 'cancel', onPress: () => router.back() },
    ]);
  };

  const canSave = wordText.trim().length > 0 && translation.trim().length > 0;

  if (!language) return null;

  return (
    <KeyboardAvoidingView
      style={[styles.wrapper, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.dragHandleRow, { paddingTop: insets.top + 8 }]}>
        <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />
      </View>

      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Add Word
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
          activeOpacity={0.6}
        >
          <FontAwesome name="times" size={22} color={colors.subtitle} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <WordForm
          language={language}
          wordText={wordText}
          onWordTextChange={setWordText}
          translation={translation}
          onTranslationChange={setTranslation}
          pronunciation={pronunciation}
          onPronunciationChange={setPronunciation}
        />

        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: colors.tint, opacity: canSave ? 1 : 0.35 },
          ]}
          onPress={handleSave}
          disabled={!canSave}
          activeOpacity={0.7}
        >
          <FontAwesome name="check" size={16} color="#0D0D0D" />
          <Text style={styles.saveText}>Save Word</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  dragHandleRow: {
    alignItems: 'center',
    paddingBottom: 4,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 36,
    paddingVertical: 16,
    borderRadius: 14,
  },
  saveText: {
    color: '#0D0D0D',
    fontSize: 17,
    fontWeight: '700',
  },
});
