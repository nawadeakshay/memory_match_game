import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { usePersistentState } from './storage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const isNumber = (value: unknown): value is number => typeof value === 'number';
const KEY = 'test.key';

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('usePersistentState', () => {
  it('uses the initial value when nothing is stored', async () => {
    const { result } = await renderHook(() => usePersistentState(KEY, 5, isNumber));
    await waitFor(() => expect(result.current[2]).toBe(true));
    expect(result.current[0]).toBe(5);
  });

  it('restores a stored value', async () => {
    await AsyncStorage.setItem(KEY, JSON.stringify(42));
    const { result } = await renderHook(() => usePersistentState(KEY, 5, isNumber));
    await waitFor(() => expect(result.current[0]).toBe(42));
    expect(result.current[2]).toBe(true);
  });

  it('ignores stored values that fail validation or are not JSON', async () => {
    await AsyncStorage.setItem(KEY, JSON.stringify('not a number'));
    const first = await renderHook(() => usePersistentState(KEY, 5, isNumber));
    await waitFor(() => expect(first.result.current[2]).toBe(true));
    expect(first.result.current[0]).toBe(5);

    await AsyncStorage.setItem(KEY, '{broken');
    const second = await renderHook(() => usePersistentState(KEY, 5, isNumber));
    await waitFor(() => expect(second.result.current[2]).toBe(true));
    expect(second.result.current[0]).toBe(5);
  });

  it('saves changes so the next launch sees them', async () => {
    const { result } = await renderHook(() => usePersistentState(KEY, 5, isNumber));
    await waitFor(() => expect(result.current[2]).toBe(true));

    await act(async () => result.current[1](7));
    await waitFor(async () => expect(await AsyncStorage.getItem(KEY)).toBe('7'));

    const relaunch = await renderHook(() => usePersistentState(KEY, 5, isNumber));
    await waitFor(() => expect(relaunch.result.current[0]).toBe(7));
  });

  it('does not overwrite stored data with the initial value on launch', async () => {
    await AsyncStorage.setItem(KEY, JSON.stringify(42));
    const { result } = await renderHook(() => usePersistentState(KEY, 5, isNumber));
    await waitFor(() => expect(result.current[2]).toBe(true));
    expect(await AsyncStorage.getItem(KEY)).toBe('42');
  });
});
