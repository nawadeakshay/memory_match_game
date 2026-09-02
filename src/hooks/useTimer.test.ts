import { act, renderHook } from '@testing-library/react-native';
import { useTimer } from './useTimer';

describe('useTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts at zero and increments once per second while running', async () => {
    const { result } = await renderHook(() => useTimer(true));
    expect(result.current.seconds).toBe(0);

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.seconds).toBe(3);
  });

  it('does not increment while not running', async () => {
    const { result } = await renderHook(() => useTimer(false));

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.seconds).toBe(0);
  });

  it('stops incrementing once isRunning switches to false', async () => {
    const { result, rerender } = await renderHook(
      (props: { isRunning: boolean }) => useTimer(props.isRunning),
      { initialProps: { isRunning: true } }
    );

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.seconds).toBe(2);

    await rerender({ isRunning: false });

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });
    expect(result.current.seconds).toBe(2);
  });

  it('reset sets the elapsed time back to zero without stopping the clock', async () => {
    const { result } = await renderHook(() => useTimer(true));

    await act(async () => {
      jest.advanceTimersByTime(4000);
    });
    expect(result.current.seconds).toBe(4);

    await act(async () => {
      result.current.reset();
    });
    expect(result.current.seconds).toBe(0);

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.seconds).toBe(1);
  });

  it('clears the interval on unmount so it cannot leak', async () => {
    const clearSpy = jest.spyOn(global, 'clearInterval');
    const { unmount } = await renderHook(() => useTimer(true));

    await unmount();

    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });
});
