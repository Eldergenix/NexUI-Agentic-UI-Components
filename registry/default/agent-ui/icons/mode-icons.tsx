export type ModeIconProps = { className?: string };

export function AgentModeIcon({ className }: ModeIconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M12 12L15.2218 15.182C17.0012 16.9393 19.8861 16.9393 21.6655 15.182C23.4448 13.4246 23.4448 10.5754 21.6655 8.81802C19.8861 7.06066 17.0012 7.06066 15.2218 8.81802L12 12ZM12 12L8.77817 8.81802C6.99881 7.06066 4.11389 7.06066 2.33452 8.81802C0.555159 10.5754 0.555159 13.4246 2.33452 15.182C4.11389 16.9393 6.99881 16.9393 8.77817 15.182L12 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function PlanModeIcon({ className }: ModeIconProps) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M13 16H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 18C7.10457 18 8 17.1046 8 16C8 14.8954 7.10457 14 6 14C4.89543 14 4 14.8954 4 16C4 17.1046 4.89543 18 6 18Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 8H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 8.75L5.5 10L8.5 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
