import React, { useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useColors from '@/components/useColors';
import useLanguage from '@/components/useLanguage';
import { getQuizWord, markReviewed, getWordCount, Word } from '@/lib/database';
import FlashCard from '@/components/FlashCard';

export default function HomeScreen() {
  const [word, setWord] = useState<Word | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cardKey, setCardKey] = useState(0);
  const colors = useColors();
  const { language, refresh: refreshLanguage } = useLanguage();
  const insets = useSafeAreaInsets();
  const activeLangRef = useRef<string | null>(null);
  const hasWordRef = useRef(false);

  const loadNext = useCallback(async (langCode: string) => {
    const [w, c] = await Promise.all([
      getQuizWord(langCode),
      getWordCount(langCode),
    ]);
    setWord(w);
    hasWordRef.current = w != null;
    setCount(c);
    setIsFlipped(false);
    setCardKey((k) => k + 1);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const langCode = await refreshLanguage();
        if (cancelled) return;

        const langChanged = activeLangRef.current !== langCode;
        activeLangRef.current = langCode;

        if (langChanged || !hasWordRef.current) {
          setLoading(true);
          await loadNext(langCode);
        } else {
          const c = await getWordCount(langCode);
          if (!cancelled) setCount(c);
          setLoading(false);
        }
      })();
      return () => { cancelled = true; };
    }, [refreshLanguage, loadNext])
  );

  const handleGotIt = async () => {
    if (word && language) {
      await markReviewed(language.code, word.id, true);
      loadNext(language.code);
    }
  };

  if (loading || !language) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Vocab</Text>
          {count > 0 && (
            <Text style={[styles.countBadge, { color: colors.pinyin }]}>
              {count} {count === 1 ? 'word' : 'words'}
            </Text>
          )}
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.langButton, { borderColor: colors.tint }]}
            onPress={() => router.push('/language-modal')}
            activeOpacity={0.7}
          >
            <Text style={styles.langFlag}>{language.flag}</Text>
            <Text style={[styles.langLabel, { color: colors.tint }]}>
              {language.nativeName}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.tint }]}
            onPress={() => router.push('/add-modal')}
            activeOpacity={0.7}
          >
            <FontAwesome name="plus" size={18} color="#0D0D0D" />
          </TouchableOpacity>
        </View>
      </View>

      {!word ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyIcon, { color: colors.subtitle }]}>
            {language.flag}
          </Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No words yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.subtitle }]}>
            Start building your {language.name} vocabulary
          </Text>
          <TouchableOpacity
            style={[styles.emptyAddButton, { backgroundColor: colors.tint }]}
            onPress={() => router.push('/add-modal')}
            activeOpacity={0.7}
          >
            <FontAwesome name="plus" size={16} color="#0D0D0D" />
            <Text style={styles.emptyAddText}>Add your first word</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cardArea}>
          <FlashCard key={cardKey} word={word} language={language} onFlip={setIsFlipped} />

          {isFlipped ? (
            <TouchableOpacity
              style={[styles.gotItButton, { backgroundColor: colors.tint }]}
              onPress={handleGotIt}
              activeOpacity={0.7}
            >
              <FontAwesome name="check" size={15} color="#0D0D0D" />
              <Text style={styles.gotItText}>Got It</Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.hint, { color: colors.pinyin }]}>
              Tap the card to reveal
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  countBadge: {
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  langFlag: {
    fontSize: 18,
  },
  langLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 15,
    marginBottom: 28,
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyAddText: {
    color: '#0D0D0D',
    fontSize: 16,
    fontWeight: '600',
  },
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  gotItButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  gotItText: {
    color: '#0D0D0D',
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    marginTop: 22,
    fontSize: 13,
    letterSpacing: 0.3,
  },
});
