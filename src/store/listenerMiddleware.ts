import { addListener, createListenerMiddleware } from "@reduxjs/toolkit";

import type { AppDispatch, RootState } from ".";

export const listenerMiddleware = createListenerMiddleware();

export const startMiddlewareListening = listenerMiddleware.startListening.withTypes<RootState, AppDispatch>();

export const addAppListener = addListener.withTypes<RootState, AppDispatch>();
