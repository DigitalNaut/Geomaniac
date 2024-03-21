import { type NullableCountryData, useCountryStore } from "src/hooks/useCountryStore";
import { useUserGuessRecordContext } from "src/contexts/GuessRecordContext";
import { useTally } from "src/hooks/useTally";
import { useInputField } from "src/hooks/useInputField";

export function useCountryQuiz(showNextCountry: () => NullableCountryData, setError: (error: Error) => void) {
  const { storedCountry: countryCorrectAnswer, compareStoredCountry: checkAnswer } = useCountryStore();
  const {
    inputRef: answerInputRef,
    setInputField: setAnswerInputField,
    focusInputField: focusAnswerInputField,
  } = useInputField();
  const { pushGuessToHistory, lastGuess, updateCountryStats } = useUserGuessRecordContext();
  const { tally: userGuessTally, incrementTally: incrementTriesTally, resetTally: resetTriesTally } = useTally();

  const giveHint = () => {
    if (countryCorrectAnswer.data) {
      // TODO: Add a better way to provide hints
      //const hint = countryCorrectAnswer.data.name.substring(0, userTries);
      const hint = countryCorrectAnswer.data.GEOUNIT;
      setAnswerInputField(hint);
    }

    focusAnswerInputField();
  };

  const resetInput = () => {
    resetTriesTally();
    setAnswerInputField("");
  };

  const submitAnswer = () => {
    if (!answerInputRef.current) {
      setError(new Error("Input field not found."));
      return false;
    }

    const userGuess = answerInputRef.current.value;
    const isCorrect = checkAnswer(userGuess);
    const isValidNewGuess = userGuess.length > 0 && userGuess !== lastGuess?.text;

    if (!isValidNewGuess) return false;

    if (isCorrect) {
      resetInput();
      const nextCountry = showNextCountry();
      if (nextCountry) focusAnswerInputField();
    } else incrementTriesTally();

    if (countryCorrectAnswer.data) {
      const { ISO_A2_EH, GU_A3, GEOUNIT } = countryCorrectAnswer.data;

      pushGuessToHistory({
        text: userGuess,
        isCorrect,
        ISO_A2_EH,
        GU_A3,
      });

      updateCountryStats({
        GEOUNIT,
        isCorrect,
        ISO_A2_EH,
        GU_A3,
      });
    }

    return isCorrect;
  };

  const skipCountry = () => {
    resetInput();
    const nextCountry = showNextCountry();
    if (nextCountry) focusAnswerInputField();
  };

  return {
    answerInputRef,
    submitAnswer,
    userGuessTally,
    giveHint,
    skipCountry,
  };
}
