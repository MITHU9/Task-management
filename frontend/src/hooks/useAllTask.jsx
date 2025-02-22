import { useQuery } from "@tanstack/react-query";
import { useAxiosPublic } from "./useAxiosPublic";

const useAllTasks = ({ email }) => {
  const axiosPublic = useAxiosPublic();

  console.log("email", email);

  const {
    isPending,
    data: allTasks = [],
    refetch,
  } = useQuery({
    queryKey: ["all-Tasks"],
    queryFn: () =>
      axiosPublic.get(`/all-tasks/${email}`).then((res) => res.data),
  });

  return [allTasks, isPending, refetch];
};
export default useAllTasks;
