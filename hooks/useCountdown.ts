import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

export type CountdownStatus = 'idle' | 'running' | 'paused' | 'finished';

/**
 * Cronômetro regressivo para os exercícios práticos.
 * Conta pelo relógio (horário de término), então não atrasa nem para quando o app vai para o segundo plano.
 */
export function useCountdown(totalSeconds: number, onFinish?: () => void) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [status, setStatus] = useState<CountdownStatus>('idle');
  const endAtRef = useRef<number | null>(null);
  const remainingRef = useRef(totalSeconds);
  remainingRef.current = remaining;
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    if (status !== 'running') return;
    const tick = () => {
      if (endAtRef.current === null) return;
      const left = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        endAtRef.current = null;
        setStatus('finished');
        onFinishRef.current?.();
      }
    };
    tick();
    const id = setInterval(tick, 250);
    const sub = AppState.addEventListener('change', (s) => s === 'active' && tick());
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, [status]);

  const start = useCallback(() => {
    setStatus((s) => {
      if (s === 'finished' || s === 'running') return s;
      endAtRef.current = Date.now() + remainingRef.current * 1000;
      return 'running';
    });
  }, []);
  const pause = useCallback(() => setStatus((s) => (s === 'running' ? 'paused' : s)), []);
  const reset = useCallback(() => {
    endAtRef.current = null;
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
