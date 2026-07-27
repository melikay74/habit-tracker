interface GrowthRingProps {
  streak: number;
  color?: string;
  size?: number;
  /** Days per full lap of the ring — the ring completes a full circle every N-day streak. */
  cycleLength?: number;
}

/**
 * A circular progress ring representing a habit's current streak. Fills
 * clockwise as the streak grows and completes a full lap every
 * `cycleLength` days (default 30), then starts a fresh lap — meant to read
 * as something growing in loops, rather than a flat calendar grid.
 */
export function GrowthRing({
  streak,
  color = "#3F7D58",
  size = 96,
  cycleLength = 30,
}: GrowthRingProps) {
  const strokeWidth = size * 0.09;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const positionInCycle = streak === 0 ? 0 : streak % cycleLength || cycleLength;
  const progress = streak === 0 ? 0 : positionInCycle / cycleLength;
  const dashOffset = circumference * (1 - progress);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${streak} day streak`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E4EAE5"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-mono text-lg font-medium leading-none">
          {streak}
        </span>
        <span className="mt-1 font-mono text-[10px] uppercase tracking-wide text-sage">
          {streak === 1 ? "day" : "days"}
        </span>
      </div>
    </div>
  );
}
