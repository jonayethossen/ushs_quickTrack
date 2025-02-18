import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export type Helper<T extends string> = T | Omit<ClassValue, T>;
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
