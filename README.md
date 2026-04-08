# WordHoard

A personal vocabulary collector for language learners. Add words, build your library, and quiz yourself with flashcards -- all offline, no account needed.

Supports **16 languages** with text-to-speech pronunciation and automatic romanization for non-Latin scripts.

## Supported Languages

| Language | Script | Pronunciation Guide |
|----------|--------|-------------------|
| 🇨🇳 Chinese (Mandarin) | Hanzi | Pinyin |
| 🇯🇵 Japanese | Kana/Kanji | Romaji |
| 🇰🇷 Korean | Hangul | Romanization |
| 🇷🇺 Russian | Cyrillic | Transliteration |
| 🇸🇦 Arabic | Arabic | Transliteration |
| 🇮🇳 Hindi | Devanagari | Transliteration |
| 🇹🇭 Thai | Thai | Transliteration |
| 🇪🇸 Spanish | Latin | -- |
| 🇫🇷 French | Latin | -- |
| 🇩🇪 German | Latin | -- |
| 🇮🇹 Italian | Latin | -- |
| 🇧🇷 Portuguese (Brazil) | Latin | -- |
| 🇻🇳 Vietnamese | Latin | -- |
| 🇹🇷 Turkish | Latin | -- |
| 🇮🇩 Indonesian | Latin | -- |
| 🇺🇸 English | Latin | -- |

## Features

- **Flashcard quiz** with weighted random selection -- less-reviewed words show up more often
- **Text-to-speech** with per-language voice and speech rate
- **Auto-romanization** for non-Latin scripts (pinyin, romaji, transliteration)
- **Per-language library** with search, edit, and delete
- **Export** your word list as a text file via the native share sheet
- **Fully offline** -- no server, no accounts, all data stored locally
- **Dark theme** with warm gold accents

## Tech Stack

- React Native + Expo SDK 54
- expo-router v6 (file-based routing)
- AsyncStorage (per-language local storage)
- expo-speech (native TTS)
- expo-file-system + expo-sharing (export)
- pinyin-pro (Chinese), wanakana (Japanese), built-in tables (Korean, Russian, Arabic, Hindi, Thai)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Install

```bash
git clone https://github.com/maxchalabi/wordhoard.git
cd WordHoard
npm install
```

### Run in browser

```bash
npx expo start --web
```

### Run on your phone (dev)

Install [Expo Go](https://expo.dev/go), then:

```bash
npx expo start
```

Scan the QR code with Expo Go.

### Build a standalone APK

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

Download the `.apk` from the link EAS gives you and install it on your phone.

## Compatibility

Tested on **Google Pixel**. Should work on any Android device running Android 6.0+ (API 23+).

The app uses the device's native text-to-speech engine for pronunciation. **Google Pixel** and most devices with Google Play Services come with Google TTS preinstalled, which has good voice coverage across all 16 supported languages. **Samsung** devices ship with Samsung TTS, which may need the [Google TTS engine](https://play.google.com/store/apps/details?id=com.google.android.tts) installed for best results with less common languages.

If a language's voice sounds robotic or is missing, go to **Settings > System > Languages > Text-to-Speech** and download the voice pack for that language.

## Project Structure

```
app/
  _layout.tsx           Root layout (dark theme, stack navigator, data migration)
  add-modal.tsx         Add Word modal
  language-modal.tsx    Language selector (16 languages)
  (tabs)/
    _layout.tsx         Bottom tabs: Home, Library
    index.tsx           Home -- language picker, flashcard quiz, add button
    library.tsx         Library -- search, word list, edit, export
lib/
  languages.ts          Language configs (16 languages)
  database.ts           AsyncStorage CRUD, migration
  speech.ts             TTS wrapper
  pronunciation.ts      Multi-language romanization
components/
  WordForm.tsx           Shared add/edit form
  WordCard.tsx           Word display card
  FlashCard.tsx          Flippable quiz card
  useColors.ts           Theme color hook
  useLanguage.ts         Selected language hook
```

## License

MIT
