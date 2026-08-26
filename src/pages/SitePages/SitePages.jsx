import { Skeleton } from "@/components/ui/skeleton";
import { getPolicies } from "@/api/mainServices";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

const SitePages = () => {
  const { slug } = useParams();

  const { data: sitePagesData, isLoading } = useQuery({
    queryKey: ["site_pages", slug],
    queryFn: () => getPolicies(slug),
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
      <div
        className="rich_content"
        dangerouslySetInnerHTML={{ __html: sitePagesData?.[slug] }}
      />
    </article>
  );
};

export default SitePages;
