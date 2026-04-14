import type { SVGProps } from "react";

export function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 2l2.2 5.6L20 10l-5.8 2.4L12 18l-2.2-5.6L4 10l5.8-2.4L12 2z" fill="currentColor" />
    </svg>
  );
}

export function ChecklistIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M8 7h11M8 12h11M8 17h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4.3 7.3l1.5 1.4L8 6.4M4.3 12.3l1.5 1.4L8 11.4M4.3 17.3l1.5 1.4L8 16.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 3.5v3M17 3.5v3M3.5 9h17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2.5 9h19M6.5 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function WhatsappIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 3.2a8.7 8.7 0 0 0-7.6 13l-1.3 4.6 4.8-1.2A8.7 8.7 0 1 0 12 3.2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 9.3c0-.4.2-.7.5-1l.6-.5c.3-.2.7-.2 1 0l1 .8c.3.2.4.6.3 1l-.3 1c0 .3 0 .6.3.8l2.1 2.1c.2.2.5.3.8.2l1-.2c.4-.1.8 0 1 .3l.8 1c.2.3.2.8 0 1l-.5.6a1.5 1.5 0 0 1-1 .5c-1.2.1-2.6-.5-4-1.8-1.3-1.3-2-2.7-1.8-4Z" fill="currentColor" />
    </svg>
  );
}

export function ActivityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M3 12h4l2.3-4 3.4 8 2.3-5H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BeforeAfterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="2.5" y="4" width="19" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 4v16" stroke="currentColor" strokeWidth="1.8" strokeDasharray="3 3" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
    </svg>
  );
}
