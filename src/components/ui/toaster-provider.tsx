"use client";

import { Toaster } from "react-hot-toast";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "12px",
          background: "#0f172a",
          color: "#f8fafc",
          fontSize: "14px",
        },
        success: {
          style: {
            border: "1px solid #22c55e33",
            background: "#052e16",
          },
        },
        error: {
          style: {
            border: "1px solid #ef444433",
            background: "#450a0a",
          },
        },
      }}
    />
  );
}
