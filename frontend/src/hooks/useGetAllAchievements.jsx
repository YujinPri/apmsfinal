import useAxiosPrivate from "./useAxiosPrivate";
import { useQuery } from "react-query";

const useGetAllAchievements = () => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async () => {
    return await axiosPrivate.get("/uploads/achievements/all");
  };
  return useQuery("achievements-all", getData, {
    staleTime: Infinity,
  });
};

export default useGetAllAchievements;
