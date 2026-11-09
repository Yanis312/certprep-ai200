"use client";

import { useEffect } from "react";

// Demande au navigateur de ne pas effacer les données du site quand il manque de place.
// Le navigateur peut refuser ; dans ce cas, la page Sauvegarde reste la protection.
export default function KeepData() {
  useEffect(() => {
    navigator.storage?.persist?.().catch(() => {});
  }, []);
  return null;
}
