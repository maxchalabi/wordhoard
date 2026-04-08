import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useColors from './useColors';
import { Word } from '@/lib/database';
import { speakWord } from '@/lib/speech';
import { LanguageConfig } from '@/lib/languages';

type Props = {
  word: Word;
  language: LanguageConfig;
  onDelete?: (id: number) => void;
  onEdit?: (word: Word) => void;
  showDelete?: boolean;
};

export default function WordCard({ word, language, onDelete, onEdit, showDelete = false }: Props) {
  const [showPronunciation, setShowPronunciation] = useState(false);
  const colors = useColors();

  const cardShadow = Platform.select({
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    android: { elevation: 4 },
    default: {},
  });

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, ...cardShadow },
      ]}
    >
      <View style={styles.content}>
        {language.hasPronunciationGuide && showPronunciation && word.pronunciation ? (
          <Text style={[styles.pronunciation, { color: colors.pinyin }]}>
            {word.pronunciation}
          </Text>
        ) : null}
        <Text style={[styles.word, { color: colors.text }]}>
          {word.word}
        </Text>
        <Text style={[styles.translation, { color: colors.subtitle }]}>
          {word.translation}
        </Text>
      </View>
      <View style={styles.actions}>
        {language.hasPronunciationGuide && word.pronunciation ? (
          <TouchableOpacity
            onPress={() => setShowPronunciation(!showPronunciation)}
            style={styles.iconButton}
            activeOpacity={0.6}
          >
            <FontAwesome
              name={showPronunciation ? 'eye' : 'eye-slash'}
              size={16}
              color={colors.pinyin}
            />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={() => speakWord(word.word, language)}
          style={styles.iconButton}
          activeOpacity={0.6}
        >
          <FontAwesome name="volume-up" size={16} color={colors.tint} />
        </TouchableOpacity>
        {onEdit && (
          <TouchableOpacity
            onPress={() => onEdit(word)}
            style={styles.iconButton}
            activeOpacity={0.6}
          >
            <FontAwesome name="pencil" size={16} color={colors.subtitle} />
          </TouchableOpacity>
        )}
        {showDelete && onDelete && (
          <TouchableOpacity
            onPress={() => onDelete(word.id)}
            style={styles.iconButton}
            activeOpacity={0.6}
          >
            <FontAwesome name="trash-o" size={16} color={colors.subtitle} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 16,
  },
  content: {
    flex: 1,
  },
  pronunciation: {
    fontSize: 12,
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  word: {
    fontSize: 22,
    fontWeight: '600',
  },
  translation: {
    fontSize: 14,
    marginTop: 3,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
