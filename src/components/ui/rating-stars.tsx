import { Star } from "lucide-react";

type RatingStarsProps = {
  value: number;
};

export function RatingStars({ value }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${value} dari 5`}>
      {Array.from({ length: 5 }, (_, idx) => {
        const active = idx < value;
        return (
          <Star
            key={idx}
            className={`size-4 ${active ? "fill-amber-400 text-amber-500" : "text-neutral-300"}`}
          />
        );
      })}
    </div>
  );
}
