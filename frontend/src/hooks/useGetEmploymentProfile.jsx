import useAxiosPrivate from "./useAxiosPrivate";
import { useQuery } from "react-query";

const useGetEmploymentProfile = () => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async () => {
    return await axiosPrivate.get(
      "/profiles/employment_profiles/me?page=1&per_page=50"
    );
  };
  return useQuery("employment-profile", getData, {
    staleTime: Infinity,
  });
};

export default useGetEmploymentProfile;