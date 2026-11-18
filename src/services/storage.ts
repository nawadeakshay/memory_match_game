import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

/**
 * useState that is saved to on-device storage and restored on the next launch.
 *
 * The stored value is loaded once on mount. If it is missing, unreadable, or
 * fails `isValid`, the initial value is kept. The third item is true once
 * loading has finished (successfully or not). If the value is changed before
 * loading finishes, the change wins and the stored value is ignored.
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T,
  isValid: (value: unknown) => value is T
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [loaded, setLoaded] = useState(false);
  // Becomes true once the stored value has been read or the user has changed the value.
  // Until then, nothing is written, so defaults never overwrite saved data.
  const canSave = useRef(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (cancelled || canSave.current || raw == null) return;
        const parsed: unknown = JSON.parse(raw);
        if (isValid(parsed)) setValue(parsed);
      })
      .catch(() => {
        // Corrupt or unreadable data: keep the initial value.
      })
      .finally(() => {
        if (cancelled) return;
        canSave.current = true;
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
    // Load once per key; isValid is expected to be a stable module-level function.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!canSave.current) return;
    AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {
      // Saving is best-effort; the game keeps working with in-memory state.
    });
  }, [key, value]);

  const setAndMark = useCallback<Dispatch<SetStateAction<T>>>((next) => {
    canSave.current = true;
    setValue(next);
  }, []);

  return [value, setAndMark, loaded];
}
