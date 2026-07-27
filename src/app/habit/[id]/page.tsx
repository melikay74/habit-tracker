import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateStreaks } from "@/lib/streaks";
import { CalendarHeatmap } from "@/components/CalendarHeatmap";
import { GrowthRing } from "@/components/GrowthRing";
import { archiveHabit } from "@/app/actions/habits";

export default async function HabitDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/");

  const habit = await prisma.habit.findFirst({
    where: { id: params.id, userId },
    include: { checkIns: true },
  });
  if (!habit) notFound();

  const checkInDates = habit.checkIns.map((c) => c.date);
  const { currentStreak, longestStreak } = calculateStreaks(checkInDates);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Link href="/" className="font-mono text-xs uppercase tracking-wide text-sage hover:text-ink">
        ← All habits
      </Link>

      <div className="mt-4 flex items-center gap-6">
        <GrowthRing streak={currentStreak} color={habit.color} size={120} />
        <div>
          <h1 className="font-display text-3xl font-medium text-ink">
            {habit.name}
          </h1>
          <p className="mt-1 font-mono text-sm text-sage">
            Best streak: {longestStreak} {longestStreak === 1 ? "day" : "days"}
          </p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="mb-2 font-display text-lg font-medium text-ink">
          Last 16 weeks
        </h2>
        <CalendarHeatmap checkInDates={checkInDates} color={habit.color} />
      </section>

      <form
        action={async () => {
          "use server";
          await archiveHabit(habit.id);
          redirect("/");
        }}
        className="mt-10"
      >
        <button
          type="submit"
          className="font-mono text-xs uppercase tracking-wide text-sage hover:text-ink"
        >
          Archive this habit
        </button>
      </form>
    </main>
  );
}
