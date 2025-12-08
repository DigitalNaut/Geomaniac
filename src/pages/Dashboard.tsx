import { faBroom } from "@fortawesome/free-solid-svg-icons";
import { motion } from "motion/react";
import type { RefObject } from "react";
import { useRef } from "react";
import { Link } from "react-router";

import ThinkingFace from "src/assets/images/mascot-thinking-bw.min.svg?url";
import unknownFlag from "src/assets/images/unknown-flag.min.svg?url";
import Button from "src/components/common/Button";
import MainView from "src/components/layout/MainView";
import { useGuessRecord } from "src/hooks/useGuessRecord";
import type { GuessStats } from "src/store/UserGuessStats/types";

type CountryProgressProps = {
  correct: number;
  incorrect: number;
};

function CountryProgress({ correct, incorrect }: CountryProgressProps) {
  const total = correct + incorrect;
  const adjustedCorrect = total < 10 ? correct : Math.round((correct / total) * 10);
  const adjustedIncorrect = total < 10 ? incorrect : 10 - adjustedCorrect;
  const padEnd = total < 10 ? 10 - adjustedCorrect - adjustedIncorrect : 0;

  return (
    <div>
      <span className="text-green-600">{"●".repeat(adjustedCorrect)}</span>
      <span className="text-yellow-600">{"●".repeat(adjustedIncorrect)}</span>
      <span className="text-gray-600">{"●".repeat(padEnd)}</span>
    </div>
  );
}

type CountryStatsProps = {
  countryStats: GuessStats;
};

function CountryStatsCard({ countryStats }: CountryStatsProps) {
  return (
    <div
      className="flex gap-2 rounded-md p-4 hover:bg-white/10"
      title={`${countryStats.GEOUNIT}\nCorrect: ${countryStats.correctGuesses}\nIncorrect: ${countryStats.incorrectGuesses}`}
    >
      <img
        className="h-[2.4rem] w-16 p-1 before:block before:h-[2.4rem] before:w-16 before:bg-custom-unknown-flag"
        src={
          countryStats.ISO_A2_EH ? `https://flagcdn.com/${countryStats.ISO_A2_EH.toLocaleLowerCase()}.svg` : unknownFlag
        }
        alt={countryStats.GU_A3}
        loading="lazy"
        width={64}
        height={38.4}
      />
      <div>
        <div className="line-clamp-2 w-32 text-sm text-ellipsis">{countryStats.GEOUNIT}</div>
        <CountryProgress correct={countryStats.correctGuesses} incorrect={countryStats.incorrectGuesses} />
      </div>
    </div>
  );
}

function useDashboard() {
  const { countryStats, clearProgress } = useGuessRecord();

  const countryStatsList = Object.values(countryStats).sort((a, b) => a.GEOUNIT.localeCompare(b.GEOUNIT));

  return {
    countryStatsList,
    clearProgress,
  };
}

function ClearProgressDialog({
  onClick,
  open,
  ref,
}: {
  onClick: () => void;
  open?: boolean;
  ref: RefObject<HTMLDialogElement | null>;
}) {
  return (
    <motion.dialog ref={ref} open={open} className="max-w-[50ch] rounded-md p-4 shadow-lg backdrop:bg-black/40">
      <h2 className="pb-2 text-xl font-bold">All progress will be lost</h2>
      <p className="text-sm">Your user guess history and country stats will be deleted.</p>
      <form className="flex justify-end gap-2 pt-4" method="dialog">
        <Button variant="danger" onClick={onClick}>
          Clear progress
        </Button>
        <Button variant="secondary">Cancel</Button>
      </form>
    </motion.dialog>
  );
}

function ClearProgressButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <div className="flex flex-col gap-2 rounded-md bg-slate-800 p-2">
      <h2 className="text-lg font-bold">Options</h2>
      <Button className="w-max bg-transparent hover:bg-slate-400/40" disabled={disabled} onClick={onClick}>
        <Button.Icon icon={faBroom} />
        <span>Clear progress</span>
      </Button>
    </div>
  );
}

export default function Dashboard() {
  const { countryStatsList, clearProgress } = useDashboard();
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <MainView className="overflow-y-auto sm:flex-col">
      <ClearProgressDialog ref={dialogRef} onClick={clearProgress} />

      <div className="flex w-full flex-1 gap-2 overflow-y-auto">
        <ClearProgressButton disabled={countryStatsList.length === 0} onClick={() => dialogRef.current?.showModal()} />

        <section className="flex flex-1 flex-col overflow-y-auto">
          <h1 className="p-2 pb-4 text-xl font-bold">Country Stats</h1>
          {countryStatsList.length === 0 ? (
            <div className="flex flex-[0.3_0.3_30%] items-center justify-center">
              <div className="rounded-md border-2 border-dashed border-slate-600 p-6 text-center">
                <img src={ThinkingFace} className="mx-auto" width={96} height={96} alt="No records found" />
                <h3 className="text-lg">No records found</h3>
                <p>
                  <Link to="/" className="text-blue-500 hover:underline">
                    Play the map
                  </Link>
                  &nbsp;to start recording your progress.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-fit flex-wrap overflow-y-auto p-2">
              {countryStatsList.map((countryStat) => (
                <CountryStatsCard key={countryStat.GU_A3} countryStats={countryStat} />
              ))}
            </div>
          )}
        </section>
      </div>
    </MainView>
  );
}
