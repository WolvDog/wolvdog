import { useCallback, useEffect, useRef, useState } from 'react';

export type CountdownStatus = 'idle' | 'running' | 'paused' | 'finished';

/** Cronômetro regressivo simples para os exercícios práticos. */
export function useCountdown(totalSeconds: number, onFinish?: () => void) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [status, setStatus] = useState<CountdownStatus>('idle');
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    if (status !== 'running') return;
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (status === 'running' && remaining === 0) {
      setStatus('finished');
      onFinishRef.current?.();
    }
  }, [status, remaining]);

  const start = useCallback(() => setStatus((s) => (s === 'finished' ? s : 'running')), []);
  const pause = useCallback(() => setStatus((s) => (s === 'running' ? 'paused' : s)), []);
  const reset = useCallback(() => {
    setRemaining(totalSeconds);
    setStatus('idle');
  }, [totalSeconds]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return {
    remaining,
    status,
    progress: totalSeconds > 0 ? 1 - remaining / totalSeconds : 1,
    label: `${minutes}:${String(seconds).padStart(2, '0')}`,
    start,
    pause,
    reset,
  };
}
