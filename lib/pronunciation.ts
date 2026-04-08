import { pinyin } from 'pinyin-pro';
import { toRomaji } from 'wanakana';

export function generatePronunciation(text: string, languageCode: string): string {
  switch (languageCode) {
    case 'zh-CN':
      return pinyin(text, { toneType: 'symbol', type: 'string' });
    case 'ja':
      return toRomaji(text);
    case 'ko':
      return romanizeKorean(text);
    case 'ru':
      return transliterateCyrillic(text);
    case 'ar':
      return transliterateArabic(text);
    case 'hi':
      return transliterateDevanagari(text);
    case 'th':
      return transliterateThai(text);
    default:
      return '';
  }
}

const CYRILLIC_MAP: Record<string, string> = {
  'А': 'A', 'а': 'a', 'Б': 'B', 'б': 'b', 'В': 'V', 'в': 'v',
  'Г': 'G', 'г': 'g', 'Д': 'D', 'д': 'd', 'Е': 'Ye', 'е': 'ye',
  'Ё': 'Yo', 'ё': 'yo', 'Ж': 'Zh', 'ж': 'zh', 'З': 'Z', 'з': 'z',
  'И': 'I', 'и': 'i', 'Й': 'Y', 'й': 'y', 'К': 'K', 'к': 'k',
  'Л': 'L', 'л': 'l', 'М': 'M', 'м': 'm', 'Н': 'N', 'н': 'n',
  'О': 'O', 'о': 'o', 'П': 'P', 'п': 'p', 'Р': 'R', 'р': 'r',
  'С': 'S', 'с': 's', 'Т': 'T', 'т': 't', 'У': 'U', 'у': 'u',
  'Ф': 'F', 'ф': 'f', 'Х': 'Kh', 'х': 'kh', 'Ц': 'Ts', 'ц': 'ts',
  'Ч': 'Ch', 'ч': 'ch', 'Ш': 'Sh', 'ш': 'sh', 'Щ': 'Shch', 'щ': 'shch',
  'Ъ': '', 'ъ': '', 'Ы': 'Y', 'ы': 'y', 'Ь': '', 'ь': '',
  'Э': 'E', 'э': 'e', 'Ю': 'Yu', 'ю': 'yu', 'Я': 'Ya', 'я': 'ya',
};

function transliterateCyrillic(text: string): string {
  return Array.from(text)
    .map((ch) => CYRILLIC_MAP[ch] ?? ch)
    .join('');
}

const ARABIC_MAP: Record<string, string> = {
  'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'aa', 'ب': 'b', 'ت': 't',
  'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh',
  'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd',
  'ط': 't', 'ظ': 'z', 'ع': "'", 'غ': 'gh', 'ف': 'f', 'ق': 'q',
  'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w',
  'ي': 'y', 'ى': 'a', 'ة': 'h', 'ء': "'",
  'َ': 'a', 'ُ': 'u', 'ِ': 'i', 'ّ': '', 'ْ': '',
  'ً': 'an', 'ٌ': 'un', 'ٍ': 'in',
};

function transliterateArabic(text: string): string {
  return Array.from(text)
    .map((ch) => ARABIC_MAP[ch] ?? ch)
    .join('');
}

const DEVANAGARI_MAP: Record<string, string> = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
  'ऋ': 'ri', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'an',
  'अः': 'ah',
  'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
  'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
  'ट': 'ta', 'ठ': 'tha', 'ड': 'da', 'ढ': 'dha', 'ण': 'na',
  'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
  'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
  'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va', 'श': 'sha',
  'ष': 'sha', 'स': 'sa', 'ह': 'ha',
  'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
  'ं': 'n', 'ः': 'h', '्': '', 'ँ': 'n',
};

function transliterateDevanagari(text: string): string {
  let result = '';
  const chars = Array.from(text);
  for (let i = 0; i < chars.length; i++) {
    const pair = chars[i] + (chars[i + 1] ?? '');
    if (DEVANAGARI_MAP[pair]) {
      result += DEVANAGARI_MAP[pair];
      i++;
    } else if (DEVANAGARI_MAP[chars[i]]) {
      result += DEVANAGARI_MAP[chars[i]];
    } else {
      result += chars[i];
    }
  }
  return result;
}

const THAI_CONSONANT_MAP: Record<string, string> = {
  'ก': 'k', 'ข': 'kh', 'ฃ': 'kh', 'ค': 'kh', 'ฅ': 'kh', 'ฆ': 'kh',
  'ง': 'ng', 'จ': 'ch', 'ฉ': 'ch', 'ช': 'ch', 'ซ': 's', 'ฌ': 'ch',
  'ญ': 'y', 'ฎ': 'd', 'ฏ': 't', 'ฐ': 'th', 'ฑ': 'th', 'ฒ': 'th',
  'ณ': 'n', 'ด': 'd', 'ต': 't', 'ถ': 'th', 'ท': 'th', 'ธ': 'th',
  'น': 'n', 'บ': 'b', 'ป': 'p', 'ผ': 'ph', 'ฝ': 'f', 'พ': 'ph',
  'ฟ': 'f', 'ภ': 'ph', 'ม': 'm', 'ย': 'y', 'ร': 'r', 'ล': 'l',
  'ว': 'w', 'ศ': 's', 'ษ': 's', 'ส': 's', 'ห': 'h', 'ฬ': 'l',
  'อ': '', 'ฮ': 'h',
};

const THAI_VOWEL_MAP: Record<string, string> = {
  'ะ': 'a', 'า': 'a', 'ิ': 'i', 'ี': 'i', 'ึ': 'ue', 'ื': 'ue',
  'ุ': 'u', 'ู': 'u', 'เ': 'e', 'แ': 'ae', 'โ': 'o', 'ใ': 'ai',
  'ไ': 'ai', 'ำ': 'am', '็': '', '์': '', 'ั': 'a', '่': '',
  '้': '', '๊': '', '๋': '',
};

function transliterateThai(text: string): string {
  return Array.from(text)
    .map((ch) => THAI_CONSONANT_MAP[ch] ?? THAI_VOWEL_MAP[ch] ?? ch)
    .join('');
}

// Revised Romanization of Korean -- built-in, no external dependency needed.
// Hangul syllables (U+AC00..U+D7A3) decompose mathematically into jamo.
const INITIAL = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
const MEDIAL = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
const FINAL = ['','k','kk','ks','n','nj','nh','t','l','lk','lm','lb','ls','lt','lp','lh','m','p','ps','s','ss','ng','j','ch','k','t','p','h'];

function romanizeKorean(text: string): string {
  let result = '';
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= 0xAC00 && code <= 0xD7A3) {
      const offset = code - 0xAC00;
      const li = Math.floor(offset / (21 * 28));
      const vi = Math.floor((offset % (21 * 28)) / 28);
      const ti = offset % 28;
      result += INITIAL[li] + MEDIAL[vi] + FINAL[ti];
    } else {
      result += ch;
    }
  }
  return result;
}
