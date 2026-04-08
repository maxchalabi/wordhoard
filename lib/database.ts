import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_LANGUAGE_CODE } from './languages';

const LEGACY_WORDS_KEY = 'vocabulary_words';
const LEGACY_ID_KEY = 'vocabulary_next_id';
const SELECTED_LANGUAGE_KEY = 'selected_language';
const MIGRATED_KEY = 'vocabulary_migrated_v2';

function wordsKey(languageCode: string): string {
  return `vocabulary_words_${languageCode}`;
}

function idKey(languageCode: string): string {
  return `vocabulary_next_id_${languageCode}`;
}

export type Word = {
  id: number;
  word: string;
  translation: string;
  pronunciation: string;
  created_at: number;
  times_reviewed: number;
};

type LegacyWord = {
  id: number;
  chinese: string;
  english: string;
  pinyin: string;
  created_at: number;
  times_reviewed: number;
};

async function loadWords(languageCode: string): Promise<Word[]> {
  const json = await AsyncStorage.getItem(wordsKey(languageCode));
  return json ? JSON.parse(json) : [];
}

async function saveWords(languageCode: string, words: Word[]): Promise<void> {
  await AsyncStorage.setItem(wordsKey(languageCode), JSON.stringify(words));
}

async function nextId(languageCode: string): Promise<number> {
  const key = idKey(languageCode);
  const val = await AsyncStorage.getItem(key);
  const id = val ? parseInt(val, 10) + 1 : 1;
  await AsyncStorage.setItem(key, id.toString());
  return id;
}

export async function migrateIfNeeded(): Promise<void> {
  const migrated = await AsyncStorage.getItem(MIGRATED_KEY);
  if (migrated) return;

  const legacyJson = await AsyncStorage.getItem(LEGACY_WORDS_KEY);
  if (legacyJson) {
    const legacyWords: LegacyWord[] = JSON.parse(legacyJson);
    const newWords: Word[] = legacyWords.map((w) => ({
      id: w.id,
      word: w.chinese,
      translation: w.english,
      pronunciation: w.pinyin,
      created_at: w.created_at,
      times_reviewed: w.times_reviewed,
    }));
    await saveWords(DEFAULT_LANGUAGE_CODE, newWords);

    const legacyNextId = await AsyncStorage.getItem(LEGACY_ID_KEY);
    if (legacyNextId) {
      await AsyncStorage.setItem(idKey(DEFAULT_LANGUAGE_CODE), legacyNextId);
    }

    await AsyncStorage.removeItem(LEGACY_WORDS_KEY);
    await AsyncStorage.removeItem(LEGACY_ID_KEY);
  }

  await AsyncStorage.setItem(MIGRATED_KEY, '1');
}

export async function getSelectedLanguage(): Promise<string> {
  const code = await AsyncStorage.getItem(SELECTED_LANGUAGE_KEY);
  return code ?? DEFAULT_LANGUAGE_CODE;
}

export async function setSelectedLanguage(code: string): Promise<void> {
  await AsyncStorage.setItem(SELECTED_LANGUAGE_KEY, code);
}

export async function insertWord(
  languageCode: string,
  wordText: string,
  translation: string,
  pronunciation: string
): Promise<void> {
  const words = await loadWords(languageCode);
  const id = await nextId(languageCode);
  words.push({
    id,
    word: wordText,
    translation,
    pronunciation,
    created_at: Date.now(),
    times_reviewed: 0,
  });
  await saveWords(languageCode, words);
}

export async function getAllWords(languageCode: string): Promise<Word[]> {
  const words = await loadWords(languageCode);
  return words.sort((a, b) => b.created_at - a.created_at);
}

export async function searchWords(languageCode: string, query: string): Promise<Word[]> {
  const words = await loadWords(languageCode);
  const lower = query.toLowerCase();
  return words
    .filter(
      (w) =>
        w.word.includes(query) ||
        w.translation.toLowerCase().includes(lower) ||
        w.pronunciation.toLowerCase().includes(lower)
    )
    .sort((a, b) => b.created_at - a.created_at);
}

export async function getRandomWord(languageCode: string): Promise<Word | null> {
  const words = await loadWords(languageCode);
  if (words.length === 0) return null;
  return words[Math.floor(Math.random() * words.length)];
}

export async function deleteWord(languageCode: string, id: number): Promise<void> {
  const words = await loadWords(languageCode);
  await saveWords(languageCode, words.filter((w) => w.id !== id));
}

function lastQuizKey(languageCode: string): string {
  return `last_quiz_word_${languageCode}`;
}

function weightedRandomPick(candidates: Word[]): Word {
  const weights = candidates.map((w) => 1 / (1 + w.times_reviewed));
  const total = weights.reduce((sum, w) => sum + w, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < candidates.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
}

export async function getQuizWord(languageCode: string): Promise<Word | null> {
  const words = await loadWords(languageCode);
  if (words.length === 0) return null;

  const lastId = await AsyncStorage.getItem(lastQuizKey(languageCode));
  const candidates =
    words.length > 1 && lastId != null
      ? words.filter((w) => w.id !== parseInt(lastId, 10))
      : words;

  const picked = weightedRandomPick(candidates);
  await AsyncStorage.setItem(lastQuizKey(languageCode), picked.id.toString());
  return picked;
}

export async function markReviewed(
  languageCode: string,
  id: number,
  gotIt: boolean
): Promise<void> {
  if (!gotIt) return;
  const words = await loadWords(languageCode);
  const word = words.find((w) => w.id === id);
  if (word) {
    word.times_reviewed += 1;
    await saveWords(languageCode, words);
  }
}

export async function updateWord(
  languageCode: string,
  id: number,
  wordText: string,
  translation: string,
  pronunciation: string
): Promise<void> {
  const words = await loadWords(languageCode);
  const word = words.find((w) => w.id === id);
  if (word) {
    word.word = wordText;
    word.translation = translation;
    word.pronunciation = pronunciation;
    await saveWords(languageCode, words);
  }
}

export async function getWordCount(languageCode: string): Promise<number> {
  const words = await loadWords(languageCode);
  return words.length;
}
