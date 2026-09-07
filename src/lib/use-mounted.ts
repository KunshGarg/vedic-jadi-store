"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// SSR-safe way to know "has this component mounted on the client yet?"
// without the cascading-render anti-pattern of setState-in-useEffect.
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
