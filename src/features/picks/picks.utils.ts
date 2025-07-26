import type { Week } from "./picks.types";

export const weeks: Week[] = [
  { id: 1, label: "Week 1" },
  { id: 2, label: "Week 2" },
  { id: 3, label: "Week 3" },
  { id: 4, label: "Week 4" },
  { id: 5, label: "Week 5" },
  { id: 6, label: "Week 6", isFuture: true },
  { id: 7, label: "Week 7", isFuture: true },
];
export const currentWeekId = 5;

export function getValidWeek(weekParam?: number): number {
  if (weekParam === undefined || !Number.isInteger(weekParam))
    return currentWeekId;
  const found = weeks.find((w) => w.id === weekParam);
  return found ? found.id : currentWeekId;
}
