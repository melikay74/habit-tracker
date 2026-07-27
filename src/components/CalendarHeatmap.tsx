interface CalendarHeatmapProps {
  checkInDates: Date[];
  color: string;
  weeks?: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Renders the last `weeks` weeks as a grid, one column per week and one
 * cell per day, filled in on days with a check-in. Complements the
 * GrowthRing (which shows the current run) by showing the longer history.
 */
export function CalendarHeatmap({
  checkInDates,
  color,
  weeks = 16,
}: CalendarHeatmapProps) {
  const checkedDayNumbers = new Set(
    checkInDates.map((d) =>
      Math.floor(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) /
          MS_PER_DAY
      )
    )
  );

  const today = new Date();
  const todayDayNumber = Math.floor(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()) /
      MS_PER_DAY
  );

  // Align the grid so the last column ends on today, oldest day first.
  const totalDays = weeks * 7;
  const startDayNumber = todayDayNumber - totalDays + 1;

  const columns: number[][] = Array.from({ length: weeks }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => startDayNumber + week * 7 + day)
  );

  return (
    <div className="flex gap-1 overflow-x-auto py-2" aria-hidden="true">
      {columns.map((column, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-1">
          {column.map((dayNumber) => {
            const isFuture = dayNumber > todayDayNumber;
            const isChecked = checkedDayNumbers.has(dayNumber);
            return (
              <div
                key={dayNumber}
                className="h-3 w-3 rounded-sm"
                style={{
                  backgroundColor: isFuture
                    ? "transparent"
                    : isChecked
                    ? color
                    : "#E4EAE5",
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
