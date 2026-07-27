import { PrismaClient } from "@prisma/client";
import { toDateOnlyUTC } from "../src/lib/streaks";

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@habit-tracker.local";

const HABITS: {
  name: string;
  color: string;
  pattern: (daysAgo: number) => boolean;
}[] = [
  {
    // 18-day unbroken streak running up to today.
    name: "Morning run",
    color: "#3F7D58", // moss
    pattern: (daysAgo) => daysAgo < 18,
  },
  {
    // Long history with a few realistic gaps, longest streak in the past.
    name: "Read 20 pages",
    color: "#D8A34D", // amber
    pattern: (daysAgo) => {
      if (daysAgo >= 60) return false;
      if (daysAgo >= 40 && daysAgo < 55) return true; // 15-day streak, now broken
      if (daysAgo < 5) return true; // short current streak
      return daysAgo % 3 !== 0; // sparse elsewhere
    },
  },
  {
    // Checked in most days, missed yesterday — currentStreak should be 1 (today only).
    name: "No sugar",
    color: "#8FA89A", // sage
    pattern: (daysAgo) => daysAgo !== 1 && daysAgo < 30,
  },
];

async function main() {
  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      email: DEMO_EMAIL,
      name: "Demo User",
    },
  });

  for (const { name, color, pattern } of HABITS) {
    const habit = await prisma.habit.upsert({
      where: { id: `${user.id}-${name}` },
      update: {},
      create: {
        id: `${user.id}-${name}`,
        userId: user.id,
        name,
        color,
      },
    });

    const today = toDateOnlyUTC(new Date());
    const checkInDates: Date[] = [];
    for (let daysAgo = 0; daysAgo < 65; daysAgo++) {
      if (!pattern(daysAgo)) continue;
      const date = new Date(today);
      date.setUTCDate(date.getUTCDate() - daysAgo);
      checkInDates.push(date);
    }

    await prisma.checkIn.deleteMany({ where: { habitId: habit.id } });
    await prisma.checkIn.createMany({
      data: checkInDates.map((date) => ({ habitId: habit.id, date })),
    });

    console.log(`Seeded ${name}: ${checkInDates.length} check-ins`);
  }

  console.log(`\nDemo user: ${DEMO_EMAIL} (id: ${user.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
