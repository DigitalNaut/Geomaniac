import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from ".";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// See: https://redux.js.org/tutorials/typescript-quick-start#define-typed-hooks
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
