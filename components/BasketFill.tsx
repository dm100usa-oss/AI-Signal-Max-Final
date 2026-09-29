"use client";

import { useEffect, useState } from "react";

// Шары — «проблем немало». Падают по очереди СВЕРХУ вниз до дна и копятся горкой
// (снизу вверх), затем гаснут на месте. Корзина не улетает.
// cx — по горизонтали, rest — конечная позиция (центр шара) по вертикали.
// Порядок в массиве = порядок падения: сначала нижний ряд, потом средний, потом горка.
const R = 12;
const DROP_FROM = 26; // стартовая высота падения (центр шара над корзиной)

const BALLS = [
  // нижний ряд — ложатся на дно ПЕРВЫМИ (дно ~y106, центр ~93)
  { from: "#3B82F6", to: "#1D4ED8", cx: 44, rest: 93 }, // синий
  { from: "#F97316", to: "#C2410C", cx: 62, rest: 94 }, // оранжевый
  { from: "#22C55E", to: "#15803D", cx: 79, rest: 92 }, // зелёный
  // средний ряд — в впадинах между нижними
  { from: "#FACC15", to: "#CA8A04", cx: 53, rest: 74 }, // жёлтый
  { from: "#A855F7", to: "#7E22CE", cx: 71, rest: 74 }, // фиолетовый
  { from: "#EC4899", to: "#BE185D", cx: 36, rest: 76 }, // розовый
  // верхняя горка — выступает над ободком, падает ПОСЛЕДНЕЙ
  { from: "#06B6D4", to: "#0E7490", cx: 62, rest: 56 }, // бирюзовый
  { from: "#EF4444", to: "#991B1B", cx: 47, rest: 58 }, // красный
];

export default function BasketFill({ size = 120 }: { size?: number }) {
  // dropped[i] = шар i уже падает/упал; fading = всё гаснет
  const [dropped, setDropped] = useState<boolean[]>(() =>
    new Array(BALLS.length).fill(false)
  );
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setDropped(new Array(BALLS.length).fill(true));
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const STEP = 520; // интервал между падениями шаров
    const startFill = 400; // задержка перед первым шаром (корзина появилась пустой)

    function run() {
      setFading(false);
      setDropped(new Array(BALLS.length).fill(false));
      // шары падают по очереди: i=0 (низ) первым, далее вверх
      for (let i = 0; i < BALLS.length; i++) {
        timers.push(
          setTimeout(() => {
            setDropped((prev) => {
              const next = prev.slice();
              next[i] = true;
              return next;
            });
          }, startFill + STEP * i)
        );
      }
      const filledAt = startFill + STEP * BALLS.length;
      // полежали — гаснут на месте
      timers.push(setTimeout(() => setFading(true), filledAt + 1600));
    }

    run();
    // цикл ровно 10 секунд — как у ScoreRing в первом аккордеоне (не частит, не забирает внимание)
    const cycle = 10000;
    const interval = setInterval(run, cycle);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 18 120 120"
      className="shrink-0"
      style={{ overflow: "visible" }}
    >
      <defs>
        {BALLS.map((b, i) => (
          <radialGradient key={i} id={`ball${i}`} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor={b.from} />
            <stop offset="100%" stopColor={b.to} />
          </radialGradient>
        ))}
        <linearGradient id="wireRim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D7DCE3" />
          <stop offset="100%" stopColor="#AEB6C2" />
        </linearGradient>
        <clipPath id="basketClip">
          <path d="M20 40 L100 40 L90 104 Q89 108 84 108 L36 108 Q31 108 30 104 Z" />
        </clipPath>
      </defs>

      {/* контур тела корзины */}
      <path
        d="M22 60 L98 60 L90 104 Q89 108 84 108 L36 108 Q31 108 30 104 Z"
        fill="none"
        stroke="#9AA3B0"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      {/* шары: каждый — группа, падение через translateY (надёжный CSS-переход) */}
      <g clipPath="url(#basketClip)">
        {BALLS.map((b, i) => {
          const isDown = dropped[i];
          // шар всегда отрисован на конечной позиции (cx, rest);
          // пока не "сброшен" — поднят вверх и прозрачен; при сбросе едет на место.
          const ty = isDown ? 0 : DROP_FROM - b.rest; // отрицательный сдвиг = выше
          const opacity = fading ? 0 : isDown ? 1 : 0;
          return (
            <g
              key={i}
              style={{
                transform: `translateY(${ty}px)`,
                opacity,
                transition: fading
                  ? "opacity 1s ease-out"
                  : "transform 0.5s cubic-bezier(0.34,1.15,0.64,1), opacity 0.2s ease-out",
              }}
            >
              <circle cx={b.cx} cy={b.rest} r={R} fill={`url(#ball${i})`} />
            </g>
          );
        })}
      </g>

      {/* передние прутья — поверх шаров */}
      {[34, 46, 60, 74, 86].map((x, i) => (
        <line
          key={i}
          x1={x}
          y1="62"
          x2={x - (x - 60) * 0.18}
          y2="106"
          stroke="#9AA3B0"
          strokeWidth="1.8"
          opacity="0.7"
        />
      ))}
      {[80, 96].map((y, i) => (
        <path
          key={i}
          d={`M${25 + i * 3} ${y} L${95 - i * 3} ${y}`}
          stroke="#9AA3B0"
          strokeWidth="1.8"
          opacity="0.65"
        />
      ))}

      {/* верхний ободок */}
      <rect
        x="18"
        y="54"
        width="84"
        height="9"
        rx="4.5"
        fill="url(#wireRim)"
        stroke="#8B94A2"
        strokeWidth="2"
      />
    </svg>
  );
}
