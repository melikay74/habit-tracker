"use client";

import { useRef, useState } from "react";
import { createHabit } from "@/app/actions/habits";

const COLOR_OPTIONS = [
  { label: "Moss", value: "#3F7D58" },
  { label: "Amber", value: "#D8A34D" },
  { label: "Clay", value: "#B5654A" },
  { label: "Slate", value: "#4A6273" },
];

export function NewHabitForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [color, setColor] = useState(COLOR_OPTIONS[0].value);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createHabit(formData);
        formRef.current?.reset();
        setColor(COLOR_OPTIONS[0].value);
      }}
      className="flex flex-wrap items-center gap-3 rounded-2xl bg-surface p-4 ring-1 ring-black/5"
    >
      <input
        name="name"
        placeholder="New habit, e.g. Read 10 pages"
        required
        maxLength={60}
        className="min-w-[220px] flex-1 rounded-lg border border-ringtrack bg-background px-3 py-2 text-sm outline-none focus:border-moss"
      />

      <input type="hidden" name="color" value={color} />
      <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Habit color">
        {COLOR_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={color === option.value}
            aria-label={option.label}
            onClick={() => setColor(option.value)}
            className={`h-6 w-6 rounded-full transition-transform ${
              color === option.value ? "scale-110 ring-2 ring-offset-2 ring-ink" : ""
            }`}
            style={{ backgroundColor: option.value }}
          />
        ))}
      </div>

      <button
        type="submit"
        className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90"
      >
        Add habit
      </button>
    </form>
  );
}
