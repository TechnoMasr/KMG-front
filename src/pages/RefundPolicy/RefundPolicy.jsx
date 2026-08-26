import { Skeleton } from "@/components/ui/skeleton";
import { getPolicies } from "@/api/mainServices";
import { useQuery } from "@tanstack/react-query";

const RefundPolicy = () => {
  const { data: policeData, isLoading } = useQuery({
    queryKey: ["refund_policy"],
    queryFn: () => getPolicies("refund_policy"),
  });

  if (isLoading) {
    return (
      <article className="container py-6">
        <Skeleton className="h-6 w-2/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </article>
    );
  }

  return (
    <article className="container py-6">
      <div dangerouslySetInnerHTML={{ __html: policeData?.refund_policy }} />
    </article>
  );
};

export default RefundPolicy;
