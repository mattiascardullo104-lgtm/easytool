"use client";

import { useEffect, useState } from "react";

const KEY = "et_premium";

export function setPremiumActive() {
  try {
    localStorage.setItem(KEY, "true");
    window.dispatchEvent(new Event("et-premium"));
  } catch {
    // ignore
  }
}

export function usePremium() {
  const [premium, setPremium] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        setPremium(localStorage.getItem(KEY) === "true");
      } catch {
        setPremium(false);
      }
      setReady(true);
    };
    read();
    window.addEventListener("et-premium", read);
    return () => window.removeEventListener("et-premium", read);
  }, []);

  return { premium, ready };
}
