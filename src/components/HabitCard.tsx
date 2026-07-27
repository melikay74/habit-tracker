import Link from "next/link";
import { GrowthRing } from "./GrowthRing";
import { CheckInButton } from "./CheckInButton";

interface HabitCardProps {
  id: string;
  name: string;
  color: string;
  currentStreak: number;
  longestStreak: number;
  checkedInToday: boolean;
}

export function HabitCard({
  id,
  name,
  color,
  currentStreak,
  longestStreak,
  checkedInToday,
}: HabitCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-black/5">
      <Link
        href={`/habit/${id}`}
        className="font-display text-lg font-medium text-ink hover:underline"
      >
        {name}
      </Link>

      <GrowthRing streak={currentStreak} color={color} />

      <p className="font-mono text-xs text-sage">
        Best streak: {longestStreak} {longestStreak === 1 ? "day" : "days"}
      </p>

      <CheckInButton habitId={id} initialCheckedIn={checkedInToday} />
    </div>
  );
}
