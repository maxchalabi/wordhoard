import { useState, useCallback } from 'react';
import { getSelectedLanguage } from '@/lib/database';
import { getLanguageByCode, LanguageConfig } from '@/lib/languages';

export default function useLanguage() {
  const [language, setLanguage] = useState<LanguageConfig | null>(null);

  const refresh = useCallback(async () => {
    const code = await getSelectedLanguage();
    setLanguage(getLanguageByCode(code));
    return code;
  }, []);

  return { language, refresh };
}
