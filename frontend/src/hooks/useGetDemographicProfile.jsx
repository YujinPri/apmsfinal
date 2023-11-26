import useAxiosPrivate from "./useAxiosPrivate";
import { useQuery } from "react-query";

const useGetDemographicProfile = () => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async () => {
    return await axiosPrivate.get("/profiles/demographic_profile/me");
  };
  return useQuery("demographic-profile", getData, {
    staleTime: Infinity,
  });
};

export default useGetDemographicProfile;
