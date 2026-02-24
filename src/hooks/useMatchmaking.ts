import { useState } from 'react';

export function useMatchmaking() {
  const [status, setStatus] = useState<'idle' | 'searching' | 'found'>('idle');
  const findMatch = () => {
    setStatus('searching');
    setTimeout(() => setStatus('found'), 1500);
  };
  return { status, findMatch };
}
