import { useRef } from "react";

export function useInputField() {
  const inputRef = useRef<HTMLInputElement>(null);

  function focusInputField() {
    inputRef.current?.focus();
  }

  function setInputField(newValue: string) {
    if (inputRef.current) inputRef.current.value = newValue;
  }

  return { inputRef, setInputField, focusInputField };
}
