import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "motion/react";
import { twJoin, twMerge } from "tailwind-merge";

import useScrollTo from "src/hooks/common/useScrollTo";
import type { GuessHistory } from "src/store/UserGuessHistory/types";

export default function GuessHistoryPanel({ guessHistory }: { guessHistory: GuessHistory }) {
  const { isScrolledToPosition, scrollToPosition, scrollRef } = useScrollTo("top");

  const guessList = guessHistory.slice(0, -1);
  const latestGuess = guessHistory.slice(-1).at(0);

  return (
    <div className="relative flex flex-col gap-2 overflow-y-auto">
      <h3 className={twJoin("text-center text-slate-300", guessHistory.length > 0 ? "visible" : "invisible")}>
        Last {guessHistory.length} guesses
      </h3>
      <div className="flex flex-1 flex-col overflow-y-auto px-2 text-ellipsis" ref={scrollRef}>
        <div className="flex flex-col-reverse pb-12">
          {guessList?.map((guess) => (
            <motion.div
              className={twMerge("flex items-center gap-2 px-1", guess.isCorrect ? "text-green-500" : "text-slate-200")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={guess.timestamp}
              title={guess.text}
            >
              <FontAwesomeIcon icon={guess.isCorrect ? faCheck : faTimes} />
              {guess.text}
            </motion.div>
          ))}
          {latestGuess && (
            <motion.div
              className={twMerge(
                "flex items-center gap-2 rounded-xs px-1 py-2 text-white",
                latestGuess.isCorrect ? "bg-green-800" : "bg-yellow-800",
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={latestGuess.timestamp}
              title={latestGuess.text}
            >
              <FontAwesomeIcon icon={latestGuess.isCorrect ? faCheck : faTimes} />
              {latestGuess.text}
            </motion.div>
          )}
          {guessHistory.length === 0 && <div className="pt-2 text-center text-sm italic">No guesses yet!</div>}
        </div>
        {!isScrolledToPosition && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-fit bg-linear-to-t from-slate-900 px-6 pt-12 pb-4">
            <button
              className="pointer-events-auto w-full rounded-md bg-white/80 text-center text-slate-900"
              role="button"
              onClick={scrollToPosition}
            >
              Scroll to top
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
