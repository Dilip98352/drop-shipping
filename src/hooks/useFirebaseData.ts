import { useState, useEffect } from 'react';
import { database } from '../firebase/config';
import { ref, onValue, off } from 'firebase/database';

export function useFirebaseData<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dataRef = ref(database, path);
    
    const unsubscribe = onValue(dataRef, 
      (snapshot) => {
        try {
          const value = snapshot.val();
          setData(value);
          setLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        }
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return () => off(dataRef, 'value', unsubscribe);
  }, [path]);

  return { data, loading, error };
}