import { useCallback, useEffect, useState } from 'react';
import { fetchInterviews } from '../services/interviewService';

export function useInterviews(params = {}) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const paramsKey = JSON.stringify(params);

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchInterviews(JSON.parse(paramsKey));
      setInterviews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { interviews, loading, error, reload };
}
