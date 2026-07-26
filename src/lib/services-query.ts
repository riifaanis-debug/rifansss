import { queryOptions } from "@tanstack/react-query";
import { listServices } from "@/lib/site.functions";

export const servicesQueryOptions = queryOptions({
  queryKey: ["services"],
  queryFn: () => listServices(),
});