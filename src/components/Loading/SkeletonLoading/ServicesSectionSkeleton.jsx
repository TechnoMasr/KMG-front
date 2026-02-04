import { Skeleton } from "@/components/ui/skeleton";

const ServicesSectionSkeleton = () => {
  return (
    <section className="container sectionPadding">
      <div className="xl:max-w-6xl mx-auto grid grid-cols-1 gap-4 lg:gap-8">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="flex flex-col gap-4 card">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-2 items-center rounded">
                  {/* Icon */}
                  <Skeleton className="w-22 h-22 rounded" />

                  {/* Text */}
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSectionSkeleton;
