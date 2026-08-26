import { Skeleton } from "@/components/ui/skeleton";

const AccountsSkeleton = () => {
  return (
    <article className="container py-6 lg:py-10 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-8">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden flex flex-col gap-4 card"
          >
            {/* Header: Platform & Country Icons/Names */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-md shrink-0" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center gap-2 flex-row-reverse">
                <Skeleton className="w-8 h-8 rounded-md shrink-0" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>

            {/* Title (line-clamp-2) */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Price & Delivery details */}
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-7 w-28 rounded-lg" />
            </div>

            {/* Buy Button */}
            <Skeleton className="h-10 w-full mt-auto rounded-md" />
          </div>
        ))}
      </div>
    </article>
  );
};

export default AccountsSkeleton;
