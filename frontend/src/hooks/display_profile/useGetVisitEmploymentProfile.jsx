import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useGetVisitEmploymentProfile = (username) => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async (username) => {
    return await axiosPrivate.get(`/profiles/employment_profile/visit/${username}`);
  };
  return useQuery(["visit-employment-profile", username], () => getData(username), {
    staleTime: Infinity,
  });
};

export default useGetVisitEmploymentProfile;
