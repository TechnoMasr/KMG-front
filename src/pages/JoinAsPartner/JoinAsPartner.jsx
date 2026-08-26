import { getPolicies } from "@/api/mainServices";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const JoinAsPartner = () => {
  const { data: joinData, isLoading } = useQuery({
    queryKey: ["join_as_partner"],
    queryFn: () => getPolicies("join_as_partner"),
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
      <div dangerouslySetInnerHTML={{ __html: joinData?.join_as_partner }} />
    </article>
  );
};

export default JoinAsPartner;
