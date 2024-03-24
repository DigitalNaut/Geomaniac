import { type NullableCountryData, useCountryStore } from "src/hooks/useCountryStore";
import { useUserGuessRecordContext } from "src/contexts/GuessRecordContext";
import { useTally } from "src/hooks/useTally";

export function useQuizClick(showNextCountry: () => NullableCountryData) {
  const { storedCountry: countryCorrectAnswer, compareStoredCountry: checkAnswer } = useCountryStore();

  const { pushGuessToHistory, lastGuess, updateCountryStats } = useUserGuessRecordContext();
  const { tally: userGuessTally, upTally: incrementTriesTally, resetTally: resetTriesTally } = useTally();

  const giveHint = () => {
    if (countryCorrectAnswer.data) {
      console.log("Correct answer:", countryCorrectAnswer.data);
    }
  };

  // Event click
  const submitAnswer = () => {
    const userGuess = "test"; //TODO: Add a better way to provide hints
    const isCorrect = checkAnswer(userGuess);

    if (isCorrect) {
      resetTriesTally();
      showNextCountry();
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

  return {
    submitAnswer,
    userGuessTally,
    giveHint,
    skipCountry: showNextCountry,
  };
}
