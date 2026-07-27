"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toDateOnlyUTC } from "@/lib/streaks";

async function requireUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) throw new Error("Not signed in");
  return userId;
}

export async function createHabit(formData: FormData) {
  const userId = await requireUserId();
  const name = String(formData.get("name") ?? "").trim();
  const color = String(formData.get("color") ?? "#3F7D58");

  if (!name) throw new Error("Habit name is required");

  await prisma.habit.create({
    data: { userId, name, color },
  });

  revalidatePath("/");
}

export async function archiveHabit(habitId: string) {
  const userId = await requireUserId();

  // Scope the update to this user's own habit — otherwise any signed-in
  // user could archive another user's habit by guessing an id.
  await prisma.habit.updateMany({
    where: { id: habitId, userId },
    data: { archived: true },
  });

  revalidatePath("/");
}

/**
 * Toggles today's check-in for a habit: creates it if missing, removes it
 * if it's already there (so an accidental tap is easy to undo).
 */
export async function toggleCheckIn(habitId: string) {
  const userId = await requireUserId();

  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
    select: { id: true },
  });
  if (!habit) throw new Error("Habit not found");

  const today = toDateOnlyUTC(new Date());

  const existing = await prisma.checkIn.findUnique({
    where: { habitId_date: { habitId, date: today } },
  });

  if (existing) {
    await prisma.checkIn.delete({ where: { id: existing.id } });
  } else {
    await prisma.checkIn.create({ data: { habitId, date: today } });
  }

  revalidatePath("/");
  revalidatePath(`/habit/${habitId}`);
}
