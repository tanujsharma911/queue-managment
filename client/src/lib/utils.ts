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
