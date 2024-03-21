import { type KeyboardEvent, type PropsWithChildren, useCallback } from "react";
import { animated, useSpring, useTrail } from "@react-spring/web";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForward, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

import type { useCountryQuiz } from "src/controllers/useCountryQuiz";
import { ActionButton } from "src/components/common/ActionButton";

import IncorrectSound from "src/assets/sounds/incorrect.mp3?url";
import CorrectSound from "src/assets/sounds/correct.mp3?url";

const incorrectAnswerAudioSrc = new URL(IncorrectSound, import.meta.url);
const correctAnswerAudioSrc = new URL(CorrectSound, import.meta.url);
const incorrectAnswerAudio = new Audio(incorrectAnswerAudioSrc.href);
const correctAnswerAudio = new Audio(correctAnswerAudioSrc.href);

function useHorizontalShakeAnimation({
  onShakeStart,
  onShakeEnd,
  shakeAmount = 7,
  shakeDuration = 400,
}: {
  onShakeStart: () => void;
  onShakeEnd: () => void;
  shakeAmount?: number;
  shakeDuration?: number;
}) {
  const [{ x }, errorShakeApi] = useSpring(() => ({
    from: { x: 0 },
  }));

  const shakeXStart = -shakeAmount;
  const shakeXEnd = shakeAmount;

  const xShake = x.to(
    [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
    [0, shakeXEnd, shakeXStart, shakeXEnd, shakeXStart, shakeXEnd, shakeXStart, 0],
  );

  const startShake = () =>
    errorShakeApi.start({
      from: { x: 0 },
      to: { x: 1 },
      config: { duration: shakeDuration },
      onStart: onShakeStart,
      onRest: onShakeEnd,
    });

  return {
    startShake,
    xShake,
  };
}

export function useFloatingPanelSlideInAnimation(shouldShow: boolean) {
  const [firstTrail, secondTrail] = useTrail(2, {
    opacity: shouldShow ? 1 : 0,
    transform: shouldShow ? "translateY(0%)" : "translateY(100%)",
  });

  return {
    firstTrail,
    secondTrail,
  };
}

function QuizHeaderSection({
  children,
  skipCountryHandler,
}: PropsWithChildren<{
  skipCountryHandler: () => void;
}>) {
  return (
    <div className="flex gap-2 rounded-md bg-slate-800">
      <p className="p-2">{children}</p>
      <button
        className="flex items-center gap-1 p-2 underline"
        role="button"
        title="Skip country"
        onClick={skipCountryHandler}
      >
        <span>Skip</span>
        <FontAwesomeIcon icon={faForward} />
      </button>
    </div>
  );
}

export default function QuizFloatingPanel({
  shouldShow,
  activity: { answerInputRef, submitAnswer, userGuessTally, giveHint, skipCountry },
}: {
  shouldShow: boolean;
  activity: ReturnType<typeof useCountryQuiz>;
}) {
  const onShakeStart = useCallback(() => {
    if (!answerInputRef.current) return;
    answerInputRef.current.disabled = true;
  }, [answerInputRef]);

  const onShakeEnd = useCallback(() => {
    if (!answerInputRef.current) return;
    answerInputRef.current.disabled = false;
    answerInputRef.current.focus();
    answerInputRef.current.select();
    incorrectAnswerAudio.pause();
  }, [answerInputRef]);

  const { startShake, xShake } = useHorizontalShakeAnimation({
    onShakeStart,
    onShakeEnd,
  });

  const { firstTrail, secondTrail } = useFloatingPanelSlideInAnimation(shouldShow);

  const handleSubmit = () => {
    const isCorrectAnswer = submitAnswer();

    if (isCorrectAnswer) {
      correctAnswerAudio.currentTime = 0;
      correctAnswerAudio.play();
    } else {
      incorrectAnswerAudio.currentTime = 0;
      incorrectAnswerAudio.play();
      startShake();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <animated.div
      className="absolute inset-x-0 bottom-8 z-[1000] mx-auto flex size-fit flex-col items-center gap-2 rounded-md text-center"
      style={firstTrail}
    >
      <animated.div style={secondTrail}>
        <QuizHeaderSection skipCountryHandler={skipCountry}>Which country is this?</QuizHeaderSection>
      </animated.div>

      <div className="flex w-fit flex-col items-center overflow-hidden rounded-md bg-slate-900 drop-shadow-lg">
        <div className="rounded-md bg-red-500">
          <animated.div className="flex w-full justify-center overflow-hidden rounded-md" style={{ x: xShake }}>
            <input
              className="p-1 pl-4 text-xl text-black focus:ring focus:ring-inset"
              ref={answerInputRef}
              onKeyDown={handleKeyDown}
              placeholder="Enter country name"
              disabled={!shouldShow}
              maxLength={50}
            />
            <ActionButton disabled={!shouldShow} onClick={handleSubmit}>
              Submit
            </ActionButton>
          </animated.div>
        </div>

        <div className="flex w-full justify-between rounded-md p-2">
          <span className="whitespace-nowrap">Guesses: {userGuessTally}</span>

          <button
            className="flex items-center gap-1 underline disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={giveHint}
          >
            <FontAwesomeIcon icon={faQuestionCircle} />
            <span>Hint!</span>
          </button>
        </div>
      </div>
    </animated.div>
  );
}
