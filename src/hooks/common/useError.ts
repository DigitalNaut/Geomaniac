import { useState } from "react";

export function useError() {
  const [error, setError] = useState<Error | null>(null);

  const dismissError = () => setError(null);

  return { error, setError, dismissError };
}
