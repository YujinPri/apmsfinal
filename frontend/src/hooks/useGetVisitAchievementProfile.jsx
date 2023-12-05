import useAxiosPrivate from "./useAxiosPrivate";
import { useQuery } from "react-query";

const useGetVisitAchievementProfile = (username) => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async (username) => {
    return await axiosPrivate.get(`/profiles/achievement_profile/visit/${username}`);
  };
  return useQuery(["visit-achievement-profile", username], () => getData(username), {
    staleTime: Infinity,
  });
};

export default useGetVisitAchievementProfile;
