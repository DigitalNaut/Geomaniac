import {
  type Dispatch,
  type SetStateAction,
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
  useMemo,
} from "react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

const ActivitySchema = z.enum(["review", "quiz"]);
const ReviewKindSchema = z.enum(["countries"]);
type ReviewKind = z.infer<typeof ReviewKindSchema>;
const QuizKindSchema = z.enum(["typing", "pointing"]);
type QuizKind = z.infer<typeof QuizKindSchema>;

type Activity =
  | {
      mode: null;
    }
  | {
      mode: "review";
      kind: ReviewKind;
    }
  | {
      mode: "quiz";
      kind: QuizKind;
    };

type MapActivityContext = {
  isRandomReviewMode: boolean;
  setRandomReviewMode: Dispatch<SetStateAction<boolean>>;
  activity?: Activity;
};

const MapActivityContext = createContext<MapActivityContext | null>(null);

function validateReviewKind(kind: string | null): kind is ReviewKind {
  return kind !== null && ReviewKindSchema.safeParse(kind).success;
}

function validateQuizKind(kind: string | null): kind is QuizKind {
  return kind !== null && QuizKindSchema.safeParse(kind).success;
}

function validateActivity(activityMode: string | null, activityKind: string | null): Activity | undefined {
  if (ActivitySchema.safeParse(activityMode).success) {
    if (activityMode === "review" && validateReviewKind(activityKind)) {
      return { mode: "review", kind: activityKind };
    } else if (activityMode === "quiz" && validateQuizKind(activityKind)) {
      return { mode: "quiz", kind: activityKind };
    }
  }
  return undefined;
}

export default function MapActivityProvider({ children }: PropsWithChildren) {
  const [isRandomReviewMode, setRandomReviewMode] = useState(false);
  const [searchParams] = useSearchParams();
  const activityMode = useMemo(() => searchParams.get("activity"), [searchParams]);
  const activityKind = useMemo(() => searchParams.get("kind"), [searchParams]);

  const activity = validateActivity(activityMode, activityKind);

  return (
    <MapActivityContext.Provider
      value={{
        isRandomReviewMode,
        setRandomReviewMode,
        activity,
      }}
    >
      {children}
    </MapActivityContext.Provider>
  );
}

export function useMapActivityContext() {
  const context = useContext(MapActivityContext);
  if (!context) throw new Error("useMapActivityContext must be used within a MapActivityProvider");

  return context;
}
