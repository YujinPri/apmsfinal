import useAxiosPrivate from "./useAxiosPrivate";
import { useQuery } from "react-query";

const useGetCareerProfile = () => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async () => {
    return await axiosPrivate.get("/profiles/career_profile/me");
  };
  return useQuery("career-profile", getData, {
    staleTime: Infinity,
  });
};

export default useGetCareerProfile;
