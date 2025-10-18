"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "promoDeadlineMDL";
const DURATION_MS = 24 * 60 * 60 * 1000; // 24h
const START_OFFSET_MS = (21 * 3600 + 43 * 60 + 12) * 1000; // 21:43:12 в миллисекундах от начала дня

// Fallback для cookies, якщо localStorage недоступний
function setCookie(name: string, value: string, days = 7) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}
function getCookie(name: string) {
  const cname = name + "=";
  const ca = decodeURIComponent(document.cookie).split(";");
  for (let c of ca) {
    while (c.charAt(0) === " ") c = c.substring(1);
    if (c.indexOf(cname) === 0) return c.substring(cname.length, c.length);
  }
  return null;
}

function getStoredDeadline(): number | null {
  try {
    const ls =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (ls) return new Date(ls).getTime();
    const cookieVal =
      typeof document !== "undefined" ? getCookie(STORAGE_KEY) : null;
    if (cookieVal) return new Date(cookieVal).getTime();
  } catch {}
  return null;
}
function storeDeadline(tsMs: number) {
  const iso = new Date(tsMs).toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, iso);
  } catch {}
  setCookie(STORAGE_KEY, iso);
}

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export function PromoTopBar() {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const now = new Date();
    const stored = getStoredDeadline();

    let deadline: number;
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const todayTarget = todayStart + START_OFFSET_MS;

    // якщо зараз пізніше 21:43:12 → дедлайн завтра 21:43:12
    const nextTarget =
      todayTarget > now.getTime() ? todayTarget : todayTarget + DURATION_MS;

    // якщо збережений дедлайн є і він у майбутньому — використовуємо його
    if (stored && stored > now.getTime()) {
      deadline = stored;
    } else {
      deadline = nextTarget;
      storeDeadline(deadline);
    }

    const tick = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) {
        // створюємо новий дедлайн ще на 24 години вперед
        deadline = Date.now() + DURATION_MS;
        storeDeadline(deadline);
        setTimeLeft(deadline - Date.now());
      } else {
        setTimeLeft(diff);
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[45px] bg-green-600 text-white">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-center px-2 2xl:px-4 text-sm sm:text-lg flex-wrap 2xl:flex-nowrap">
        <span className="font-semibold">
          Мин. цена <span className="bg-red-600 rounded-md"> 149 лей </span>
        </span>
        <span className="opacity-95 line-through ml-2">300 лей</span>
        <span className="mx-2 opacity-70">|</span>
        <span className="font-mono">осталось: {formatTime(timeLeft)}</span>
      </div>
    </div>
  );
}
