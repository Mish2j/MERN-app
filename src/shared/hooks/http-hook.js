import { useCallback, useState } from "react";

export const useHttpsClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      try {
        const response = await fetch(url, { method, body, headers });

        if (!response.ok) {
          throw new Error(response.message);
        }

        const responseData = response.json();

        return responseData;
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    },
    []
  );

  const clearError = () => setError(null);

  return {
    isLoading,
    error,
    sendRequest,
    clearError,
  };
};
