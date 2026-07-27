import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateStreaks, isCheckedInToday } from "@/lib/streaks";
import { HabitCard } from "@/components/HabitCard";
import { NewHabitForm } from "@/components/NewHabitForm";
import { SignInButtons } from "@/components/SignInButtons";
import { SignOutButton } from "@/components/SignOutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="font-display text-4xl font-medium text-ink">
          Small check-ins, tracked as they grow.
        </h1>
        <p className="max-w-sm text-sage">
          One tap a day. The ring fills in, the streak builds, and you can
          see the shape of your habits over time.
        </p>
        <SignInButtons />
      </main>
    );
  }

  const habits = await prisma.habit.findMany({
    where: { userId, archived: false },
    orderBy: { createdAt: "asc" },
    include: { checkIns: true },
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-ink">
          Your habits
        </h1>
        <SignOutButton />
      </header>

      <div className="mb-8">
        <NewHabitForm />
      </div>

      {habits.length === 0 ? (
        <p className="text-sage">
          No habits yet — add your first one above to start your first
          streak.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => {
            const checkInDates = habit.checkIns.map((c) => c.date);
            const { currentStreak, longestStreak } =
              calculateStreaks(checkInDates);

            return (
              <HabitCard
                key={habit.id}
                id={habit.id}
                name={habit.name}
                color={habit.color}
                currentStreak={currentStreak}
                longestStreak={longestStreak}
                checkedInToday={isCheckedInToday(checkInDates)}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
