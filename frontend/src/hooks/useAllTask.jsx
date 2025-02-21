import { useQuery } from "@tanstack/react-query";
import { useAxiosPublic } from "./useAxiosPublic";

const useAllTasks = () => {
  const axiosPublic = useAxiosPublic();

  //console.log("currentPage", currentPage);

  const {
    isPending,
    data: allTasks = [],
    refetch,
  } = useQuery({
    queryKey: ["all-Tasks"],
    queryFn: () => axiosPublic.get(`/all-tasks`).then((res) => res.data),
  });

  return [allTasks, isPending, refetch];
};
export default useAllTasks;
