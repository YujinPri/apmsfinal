import useAxiosPrivate from "./useAxiosPrivate";
import { useQuery } from "react-query";

const useGetAchievementProfiles = () => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async () => {
    return await axiosPrivate.get(`/profiles/achievement/me`);
  };
  return useQuery(["achievements-profile"], () => getData(), {
    staleTime: Infinity,
  });
};

export default useGetAchievementProfiles;
