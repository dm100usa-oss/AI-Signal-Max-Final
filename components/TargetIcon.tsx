// Мишень «попадание в десятку» — символ точного решения.
// Синий круг той же заливки, что кружок с номером (#1a4a7a),
// белые кольца и перекрестья (выходят за круг), красная точка в центре.
// size — диаметр синего круга (без выходящих наружу перекрестий), как у кружка с цифрой.
export default function TargetIcon({
  size = 48,
  color = "#1a4a7a",
}: {
  size?: number;
  color?: string;
}) {
  // рисуем в системе 100x100, круг радиусом 38 (перекрестья торчат до края 100)
  // итоговый бокс делаем чуть больше круга, чтобы перекрестья помещались
  const box = size * (100 / 76); // круг d=76 в боксе 100 → масштаб
  return (
    <svg
      width={box}
      height={box}
      viewBox="0 0 100 100"
      className="shrink-0"
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      {/* перекрестья — рисуем под кругом, белые с тонкой синей окантовкой, торчат наружу */}
      {/* вертикальное */}
      <rect x="46.5" y="4" width="7" height="92" rx="3.5" fill={color} />
      <rect x="48" y="6" width="4" height="88" rx="2" fill="#FFFFFF" />
      {/* горизонтальное */}
      <rect x="4" y="46.5" width="92" height="7" rx="3.5" fill={color} />
      <rect x="6" y="48" width="88" height="4" rx="2" fill="#FFFFFF" />

      {/* синий круг — основа */}
      <circle cx="50" cy="50" r="38" fill={color} />

      {/* белое внешнее кольцо */}
      <circle cx="50" cy="50" r="27" fill="none" stroke="#FFFFFF" strokeWidth="5" />
      {/* белое внутреннее кольцо */}
      <circle cx="50" cy="50" r="15" fill="none" stroke="#FFFFFF" strokeWidth="5" />

      {/* перекрестья поверх колец внутри круга (чтобы линии шли непрерывно) */}
      <rect x="48" y="12" width="4" height="76" rx="2" fill="#FFFFFF" />
      <rect x="12" y="48" width="76" height="4" rx="2" fill="#FFFFFF" />

      {/* красная точка — «десятка» */}
      <circle cx="50" cy="50" r="8.5" fill="#E8112D" />
    </svg>
  );
}
