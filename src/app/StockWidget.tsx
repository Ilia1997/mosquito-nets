"use client";
import { useEffect, useState } from "react";

export function StockWidget() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 7000);
    return () => window.clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed right-4 bottom-4 top-auto z-[60] w-[280px] rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur sm:right-6 sm:bottom-6">
      <div className="flex items-start gap-2">
        <div className="mt-[5px] h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-600" />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-gray-900">
            Осталось материала
          </div>
          <div className="mt-1 text-sm text-gray-700">
            на <span className="font-bold">55</span> сеток. Успейте заказать!
          </div>
          <button
            onClick={() => {
              const el = document.querySelector("#calc");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              setVisible(false);
            }}
            className="mt-3 inline-flex items-center rounded-xl border px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-50"
          >
            Рассчитать сейчас
          </button>
        </div>
        <button
          onClick={() => setVisible(false)}
          aria-label="Закрыть"
          className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 absolute top-2 right-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
