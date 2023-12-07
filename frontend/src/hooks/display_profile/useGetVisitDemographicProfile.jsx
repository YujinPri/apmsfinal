import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useGetVisitDemographicProfile = (username) => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async (username) => {
    return await axiosPrivate.get(
      `/profiles/demographic_profile/visit/${username}`
    );
  };
  return useQuery(
    ["visit-demographic-profile", username],
    () => getData(username),
    {
      staleTime: Infinity,
    }
  );
};

export default useGetVisitDemographicProfile;
