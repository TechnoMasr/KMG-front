import { Skeleton } from "@/components/ui/skeleton";

const OffersSkeleton = () => {
  return (
    <article className="container py-6 lg:py-10 space-y-6">
      <div className="flex flex-wrap justify-center gap-4 h-fit">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden card w-[150px] flex flex-col items-center gap-2"
          >
            <Skeleton className="w-full aspect-square h-24" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-0.5 w-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </article>
  );
};

export default OffersSkeleton;
