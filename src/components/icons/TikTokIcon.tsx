import { LucideProps } from "lucide-react";

export const TikTokIcon = ({ size = 24, ...props }: LucideProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 015.9 5.82s-.51.5 0 0" />
    <path d="M17 15.6c-3.36 0-6.1-2.74-6.1-6.1v-4.7c0-.55-.45-1-1-1s-1 .45-1 1v4.7c0 4.46 3.64 8.1 8.1 8.1s8.1-3.64 8.1-8.1v-4.7c0-.55-.45-1-1-1s-1 .45-1 1v4.7c0 3.36-2.74 6.1-6.1 6.1z" />
    <path d="M5.9 15.6c-3.36 0-6.1-2.74-6.1-6.1v-4.7c0-.55-.45-1-1-1s-1 .45-1 1v4.7c0 4.46 3.64 8.1 8.1 8.1s8.1-3.64 8.1-8.1v-4.7c0-.55-.45-1-1-1s-1 .45-1 1v4.7c0 3.36-2.74 6.1-6.1 6.1z" />
  </svg>
);