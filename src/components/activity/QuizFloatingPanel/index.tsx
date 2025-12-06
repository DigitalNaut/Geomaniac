import { faForwardStep, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import type { KeyboardEvent, PropsWithChildren, RefObject } from "react";
import { useState } from "react";

import { InlineButton } from "src/components/activity/InlineButton";
import { ActionButton } from "src/components/common/ActionButton";
import type { CountryData } from "src/store/CountryStore/types";
import { useAppSelector } from "src/store/hooks";
import type { QuizKind } from "src/types/map-activity";
import { useShakeAnimation } from "./hooks";

import unknownFlag from "src/assets/images/unknown-flag.min.svg?url";
import { selectCurrentCountryData } from "src/store/CountryStore/slice";

function QuizHeaderSection({
  children,
  skipCountryHandler,
}: PropsWithChildren<{
  skipCountryHandler: () => void;
}>) {
  return (
    <div className="flex gap-2 rounded-md bg-slate-800">
      <div className="p-2">{children}</div>
      <button
        className="flex items-center gap-1 p-2 underline"
        role="button"
        title="Skip country"
        onClick={skipCountryHandler}
      >
        <span>Skip</span>
        <FontAwesomeIcon icon={faForwardStep} />
      </button>
    </div>
  );
}

function QuizPointerSection({ children }: PropsWithChildren) {
  return (
    <div className="flex items-center gap-4 rounded-md bg-white/50 px-8 py-6 text-xl text-slate-800 shadow-xl backdrop-blur-xl">
      {children}
    </div>
  );
}

function CountryFlag({ a2 }: { a2?: string }) {
  const [error, setError] = useState<Error | null>(null);

  const src = a2 ? `https://flagcdn.com/${a2.toLocaleLowerCase()}.svg` : undefined;

  if (error) {
    return <img className="h-[2.4rem] w-16 p-1" src={unknownFlag} loading="lazy" width={64} height={38.4} />;
  }

  return (
    <img
      className="h-[2.4rem] w-16 p-1 shadow-md before:block before:h-[2.4rem] before:w-16 before:bg-custom-unknown-flag"
      src={src}
      loading="lazy"
      width={64}
      height={38.4}
      onError={() => {
        setError(new Error(`Failed to load flag for ${a2}`));
      }}
    />
  );
}

const animationVariants: Variants = {
  hidden: { opacity: 0, translateY: "2rem", transition: { duration: 0.1 } },
  visible: { opacity: 1, translateY: 0, transition: { duration: 0.2 } },
};

function AnimatedPanel({ children }: PropsWithChildren) {
  return (
    <motion.div
      className="absolute inset-x-0 bottom-8 z-1000 mx-auto flex size-fit flex-col items-center gap-2 text-center"
      variants={animationVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {children}
    </motion.div>
  );
}

export default function QuizFloatingPanel({
  mode,
  userGuessTally,
  inputRef,
  submitAnswer,
  skipCountry,
  giveHint,
}: {
  mode?: QuizKind;
  userGuessTally: number;
  inputRef: RefObject<HTMLInputElement | null>;
  skipCountry: () => void;
  submitAnswer?: (text: string) => CountryData | null;
  giveHint: () => void;
}) {
  const currentCountry = useAppSelector(selectCurrentCountryData("quiz"));

  const onShakeStart = () => {
    if (!inputRef.current) return;

    inputRef.current.disabled = true;
  };

  const onShakeEnd = () => {
    if (!inputRef.current) return;

    inputRef.current.disabled = false;
    inputRef.current.focus();
    inputRef.current.select();
  };

  const { startShake, scope } = useShakeAnimation({
    onShakeStart,
    onShakeEnd,
    shakeAmount: 12,
  });

  const handleSubmit = () => {
    const isCorrectAnswer = submitAnswer?.(inputRef.current?.value ?? "");

    if (!isCorrectAnswer) startShake();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  if (!currentCountry) return <AnimatedPanel>No country selected.</AnimatedPanel>;

  const { GEOUNIT, ISO_A2_EH } = currentCountry;

  return (
    <AnimatedPanel>
      <motion.div>
        {mode === "typing" && (
          <QuizHeaderSection skipCountryHandler={skipCountry}>Which country is this?</QuizHeaderSection>
        )}
        {mode === "pointing" && (
          <QuizPointerSection>
            <span>
              Where is <strong>{GEOUNIT}</strong>?
            </span>
            <CountryFlag a2={ISO_A2_EH} />
          </QuizPointerSection>
        )}
      </motion.div>

      <div className="flex w-fit flex-col items-center overflow-hidden rounded-md bg-slate-900 p-2 drop-shadow-lg">
        {mode === "typing" && (
          <div className="rounded-md bg-red-500">
            <motion.div className="flex w-full justify-center overflow-hidden rounded-md" ref={scope}>
              <input
                className="bg-white p-1 pl-4 text-xl text-black focus:ring-3 focus:ring-inset"
                ref={inputRef}
                onKeyDown={handleKeyDown}
                placeholder="Enter country name"
                maxLength={50}
              />
              <ActionButton onClick={handleSubmit}>Submit</ActionButton>
            </motion.div>
          </div>
        )}

        <div className="flex w-full items-center justify-between gap-4 rounded-md px-1 drop-shadow-sm">
          <span className="px-6 py-4 whitespace-nowrap">Guesses: {userGuessTally}</span>

          {mode === "typing" && (
            <button
              className="flex items-center gap-1 p-4 underline disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={giveHint}
            >
              <FontAwesomeIcon icon={faQuestionCircle} />
              <span>Hint!</span>
            </button>
          )}

          {mode === "pointing" && (
            <InlineButton title="Skip country" onClick={skipCountry}>
              <span className="no-underline">Skip</span>
              <FontAwesomeIcon icon={faForwardStep} />
            </InlineButton>
          )}
        </div>
      </div>
    </AnimatedPanel>
  );
}
