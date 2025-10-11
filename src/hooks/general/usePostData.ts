import { useState, useCallback } from "react";

export function usePostData<TInput, TOutput>(
  apiCall: (input: TInput) => Promise<TOutput>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TOutput | null>(null);

  const postData = useCallback(
    async (input: TInput): Promise<TOutput | null> => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await apiCall(input);
        setData(response);
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error desconocido";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiCall] // <- memoiza la función
  );

  return { postData, loading, error, data };
}