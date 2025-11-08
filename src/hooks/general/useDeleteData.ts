import { useState, useCallback } from "react";

export function useDeleteData<TInput>(
    apiCall: (input: TInput) => Promise<void>
    ) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const deleteData = useCallback(
        async (input: TInput): Promise<boolean> => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await apiCall(input);
            setSuccess(true);
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error desconocido";
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
        },
        [apiCall]
    );

    return { deleteData, loading, error, success };
}
