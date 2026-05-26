import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useHelpModal(screenKey) {
  const [helpVisible, setHelpVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const seen = await AsyncStorage.getItem(`@help_seen_${screenKey}`);
        if (!seen) {
          setHelpVisible(true);
          await AsyncStorage.setItem(`@help_seen_${screenKey}`, '1');
        }
      } catch {}
    })();
  }, []);

  return {
    helpVisible,
    showHelp: () => setHelpVisible(true),
    hideHelp: () => setHelpVisible(false),
  };
}
