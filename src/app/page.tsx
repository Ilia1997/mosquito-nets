"use client";
import { useMemo, useRef, useState } from "react";
import * as Label from "@radix-ui/react-label";
import Image from "next/image";
import { PromoTopBar } from "@/app/PagePromoTop";
import { StockWidget } from "@/app/StockWidget";
import ModalEmailForm from "@/app/ModalEmailForm";

// --- ПРАЙС/НАСТРОЙКИ ---
const PRICE_PER_M2 = 90; // MDL за м² (пример)
const MIN_PRICE_PER_UNIT = 149; // MDL минимальная цена за 1 сетку

function formatMDL(value: number) {
  try {
    return new Intl.NumberFormat("ru-MD", {
      style: "currency",
      currency: "MDL",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${Math.round(value)} MDL`;
  }
}

export default function MosquitoScreensLanding() {
  const calcRef = useRef<HTMLDivElement | null>(null);
  const [widthMm, setWidthMm] = useState<number | "">("");
  const [heightMm, setHeightMm] = useState<number | "">("");
  const [qty, setQty] = useState<number | "">("");
  const [modalState, setModalState] = useState(false);
  const [message, setMessage] = useState("");

  const areaM2 = useMemo(() => {
    if (!widthMm || !heightMm || !qty) return 0;
    const w = Number(widthMm) / 1000;
    const h = Number(heightMm) / 1000;
    const a = w * h;
    if (a <= 0) return 0;
    return a * Number(qty);
  }, [widthMm, heightMm, qty]);

  const rawTotal = useMemo(() => {
    if (!widthMm || !heightMm || !qty) return 0;
    const perUnitArea = (Number(widthMm) / 1000) * (Number(heightMm) / 1000);
    const perUnitPrice = Math.max(
      perUnitArea * PRICE_PER_M2,
      MIN_PRICE_PER_UNIT
    );
    return perUnitPrice * Number(qty);
  }, [widthMm, heightMm, qty]);

  const perUnitPrice = useMemo(() => {
    if (!widthMm || !heightMm) return 0;
    const perUnitArea = (Number(widthMm) / 1000) * (Number(heightMm) / 1000);
    return Math.max(perUnitArea * PRICE_PER_M2, MIN_PRICE_PER_UNIT);
  }, [widthMm, heightMm]);

  const scrollToCalc = () => {
    calcRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hasErrors = useMemo(() => {
    const w = Number(widthMm);
    const h = Number(heightMm);
    const q = Number(qty);
    if (!w || !h || !q) return true;
    if (w < 300 || w > 2200) return true; // пример технических ограничений
    if (h < 300 || h > 2200) return true;
    if (q < 1 || q > 50) return true;
    return false;
  }, [widthMm, heightMm, qty]);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <PromoTopBar />
      <StockWidget />
      <ModalEmailForm
        open={modalState}
        setOpen={setModalState}
        message={message}
      />

      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:py-20 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Москитные сетки для окон
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Производим наружные рамочные москитные сетки в Молдове. Быстрый
                расчет цены, и гарантия качества.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={scrollToCalc}
                  className="rounded-2xl bg-black px-6 py-3 text-white shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-black/40"
                >
                  Заказать
                </button>
                <a
                  href="#about"
                  className="rounded-2xl border px-6 py-3 text-sm hover:bg-gray-50"
                >
                  Подробнее о сетках
                </a>
              </div>
              <ul className="mt-6 space-y-2 text-sm text-gray-700">
                <li>• Индивидуальное изготовление под ваши размеры</li>
                <li>• Прочная алюминиевая рамка и качественное полотно</li>
                <li>• Защита от комаров, мошек и пыли, не мешает обзору</li>
              </ul>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-lg">
                <Image
                  width={"1000"}
                  height={"750"}
                  src="/Ramochnye-moskitnye-setki-3.webp"
                  alt="Москітная сетка на окне"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section ref={calcRef} className="bg-gray-50 py-16" id="calc">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Рассчитать приблизительную стоимость
          </h2>
          <p className="mt-2 text-gray-600">
            Укажите размеры <span className="font-medium">в миллиметрах</span> и
            количество окон.
          </p>

          <div className="mt-8 grid gap-6 rounded-3xl bg-white p-6 shadow">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <Label.Root className="mb-1 block text-sm font-medium">
                  Ширина (мм)
                </Label.Root>
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="например, 800"
                  className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/40"
                  value={widthMm}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    setWidthMm(v ? Number(v) : "");
                  }}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Допустимо: 300–2200 мм
                </p>
              </div>
              <div>
                <Label.Root className="mb-1 block text-sm font-medium">
                  Высота (мм)
                </Label.Root>
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="например, 1200"
                  className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/40"
                  value={heightMm}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    setHeightMm(v ? Number(v) : "");
                  }}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Допустимо: 300–2200 мм
                </p>
              </div>
              <div>
                <Label.Root className="mb-1 block text-sm font-medium">
                  Количество (шт.)
                </Label.Root>
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="1"
                  className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/40"
                  value={qty}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    setQty(v ? Number(v) : "");
                  }}
                />
                <p className="mt-1 text-xs text-gray-500">От 1 до 50</p>
              </div>
            </div>

            <div className="grid gap-3 rounded-2xl bg-gray-50 p-4">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>Площадь (суммарно):</span>
                <span className="font-medium">{areaM2.toFixed(2)} м²</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>Цена за 1 сетку:</span>
                <span className="font-medium">
                  {perUnitPrice ? formatMDL(perUnitPrice) : "—"}
                </span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Итого:</span>
                <span>{rawTotal ? formatMDL(rawTotal) : "—"}</span>
              </div>
              <p className="text-xs text-gray-500">
                * Если у вас разные размеры окон, свяжитесь с нами для точного
                расчета.
              </p>
              <p className="text-xs text-gray-500">
                * В стоимости учтены материалы и сборка. Доставка/монтаж
                рассчитываются отдельно в зависимости от города.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                disabled={hasErrors}
                className="rounded-2xl bg-black px-5 py-3 text-white shadow hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={async () => {
                  if (hasErrors) return;
                  const w = Number(widthMm);
                  const h = Number(heightMm);
                  const q = Number(qty);
                  const msg = `Размеры: ${w}×${h} мм, количество: ${q}.\nИтого к оплате: ${formatMDL(
                    rawTotal
                  )}.`;
                  setMessage(msg);
                  setModalState(true);
                }}
              >
                Узнать итоговую стоимость
              </button>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="rounded-2xl border px-5 py-3 text-sm hover:bg-gray-50"
              >
                Вернуться наверх
              </button>
            </div>

            {/* Подсказки/валидация */}
            {hasErrors && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
                Проверьте поля: ширина и высота 300–2200 мм, количество 1–50.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl font-bold sm:text-3xl">
                О наших москитных сетках
              </h2>
              <p className="mt-4 text-gray-700">
                Мы производим{" "}
                <span className="font-medium">
                  наружные оконные москитные сетки с алюминиевой рамкой
                </span>
                . Они устанавливаются снаружи окна, плотно прилегают, не портят
                вид и эффективно защищают дом от насекомых. Полотно — устойчивое
                к погоде и ультрафиолету, пропускает воздух и свет, сохраняя
                комфорт в помещении.
              </p>
              <ul className="mt-6 space-y-2 text-gray-700">
                <li>• Индивидуальный размер под каждое окно</li>
                <li>• Крепления, удобные для сезонного снятия и ухода</li>
                <li>• Прочная рамка, аккуратные угловые соединения</li>
              </ul>
              <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                Срок изготовления обычно 1–3 дня. Монтаж возможен в день
                доставки или по договоренности.
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-lg">
                <Image
                  width={"1000"}
                  height={"750"}
                  src="/setka-1.webp"
                  alt="Рамочная москітная сетка крупным планом"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* REVIEWS */}
      <section id="reviews" className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold sm:text-3xl">Отзывы клиентов</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Марина, Кишинёв",
                text: "Заказали 6 сеток на квартиру. Замер, изготовление и монтаж прошли быстро. Сетки сидят плотно, вид из окна не закрывают.",
              },
              {
                name: "Ион, Бельцы",
                text: "Отличное качество рамок и креплений. Летом комаров стало заметно меньше, можно спать с открытым окном.",
              },
              {
                name: "Ольга, Сороки",
                text: "Понравилось, что сделали точно по размерам. Цена прозрачная, без скрытых доплат.",
              },
            ].map((r, i) => (
              <div key={i} className="rounded-2xl bg-white p-6 shadow">
                <div className="text-lg font-semibold">{r.name}</div>
                <p className="mt-3 text-gray-700">“{r.text}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold sm:text-3xl">Частые вопросы</h2>
          <div className="mt-8 divide-y divide-gray-200 rounded-2xl border overflow-hidden ">
            {[
              {
                q: "Как правильно снять размеры окна?",
                a: "Измерьте световой проём рамки по ширине и высоте в миллиметрах (три замера по каждой стороне) и укажите минимальные значения. Если сомневаетесь — мы можем помочь с замером.",
              },
              {
                q: "Что входит в цену?",
                a: "Изготовление рамки, полотно и сборка. Доставка и монтаж рассчитываются отдельно в зависимости от города.",
              },
              {
                q: "Можно ли снять сетку на зиму?",
                a: "Да, рамочные сетки легко снимаются. Рекомендуем мыть тёплой водой с мягким средством и хранить в сухом помещении.",
              },
              {
                q: "Какие ограничения по размерам?",
                a: "Стандартно — от 300 до 2200 мм по каждой стороне. Если у вас нестандартное окно, напишите нам — подскажем решение.",
              },
            ].map((item, i) => (
              <details key={i} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4 font-medium hover:bg-gray-50">
                  <span>{item.q}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition">
                    ▾
                  </span>
                </summary>
                <div className="px-4 pb-5 text-gray-700">{item.a}</div>
                <div className="h-px w-full bg-gray-200" />
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / CONTACTS */}
      <section className="bg-black py-16 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center lg:px-8">
          <h3 className="text-2xl font-bold sm:text-3xl">
            Готовы защитить дом от комаров?
          </h3>

          {/* <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={scrollToCalc}
              className="rounded-2xl bg-white px-6 py-3 font-medium text-black hover:opacity-90"
            >
              Рассчитать сейчас
            </button>
            <a
              href="tel:+37300000000"
              className="rounded-2xl border border-white/30 px-6 py-3 text-white hover:bg-white/10"
            >
              Позвонить: +373 00 000 000
            </a>
          </div> */}
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Mosquito-nets.md — москітные сетки с рамкой
      </footer>
    </main>
  );
}
