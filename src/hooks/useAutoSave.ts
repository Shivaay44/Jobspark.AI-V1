import { useEffect } from "react";

export function useAutoSave(
  key: string,
  data: unknown
) {
  useEffect(() => {
    localStorage.setItem(
      key,
      JSON.stringify(data)
    );
  }, [key, data]);
}
