import useAxiosPrivate from "./useAxiosPrivate";
import { useQuery } from "react-query";

const useGetAchievementSpecific = (achievementID) => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async (achievementID) => {
    return await axiosPrivate.get(`/profiles/achievement/${achievementID}`);
  };
  return useQuery(
    ["achievement-profile-specific", achievementID],
    () => getData(achievementID),
    {
      staleTime: Infinity,
    }
  );
};

export default useGetAchievementSpecific;
