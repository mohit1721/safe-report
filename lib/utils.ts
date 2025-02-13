// import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }


// ***tailwind issue
import clsx from "clsx";
import { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
// import * as twMerge from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
