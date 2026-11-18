"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

function subscribeToNothing(): () => void {
  return () => {};
}

export default function Portal({ children }: { children: React.ReactNode }) {
  const isClient = useSyncExternalStore(subscribeToNothing, () => true, () => false);

  if (!isClient) return null;
  return createPortal(children, document.body);
}
