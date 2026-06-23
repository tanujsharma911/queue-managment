import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatSessionTime = (milliseconds: number): string => {
  if (!milliseconds || isNaN(milliseconds) || milliseconds === 0) {
    return "0 mins";
  }

  // Convert ms to total seconds
  const totalSeconds = Math.floor(milliseconds / 1000);

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Format the output cleanly
  if (minutes === 0) {
    return `${seconds} secs`;
  }

  // Pad the seconds with a leading zero if under 10 (e.g., "5:03")
  const paddedSeconds = seconds.toString().padStart(2, "0");
  return `${minutes}:${paddedSeconds} mins`;
};

export const getFormattedWaitTime = (
  calledAt?: string | Date | null,
): string => {
  if (!calledAt) return "0 min"; // Return default if calledAt is missing

  // 1. Get the difference in milliseconds
  const diffInMs = Date.now() - new Date(calledAt).getTime();

  // 2. Convert to total minutes (ignoring negative numbers if future dates are possible)
  const totalMinutes = Math.abs(Math.floor(diffInMs / (1000 * 60)));

  // 3. Extract hours and remaining minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // 4. Format the output
  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }

  return `${minutes} min`;
};
