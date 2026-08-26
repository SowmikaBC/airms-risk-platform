import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoString: string): string {
  if (!isoString) return "â€”";
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(d);
  } catch {
    return isoString;
  }
}

export function formatFullDate(isoString: string): string {
  if (!isoString) return "â€”";
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("en", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  } catch {
    return isoString;
  }
}
