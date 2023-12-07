import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useGetVisitCareerProfile = (username) => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async (username) => {
    return await axiosPrivate.get(
      `/profiles/career_profile/visit/${username}`
    );
  };
  return useQuery(
    ["visit-career-profile", username],
    () => getData(username),
    {
      staleTime: Infinity,
    }
  );
};

export default useGetVisitCareerProfile;
