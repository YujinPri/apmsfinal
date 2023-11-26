import useAxiosPrivate from "./useAxiosPrivate";
import { useQuery } from "react-query";

const useGetEmploymentSpecific = (employmentID) => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async (employmentID) => {
    return await axiosPrivate.get(
      `/profiles/employment_profiles/${employmentID}`
    );
  };
  return useQuery(
    ["employment-profile-specific", employmentID],
    () => getData(employmentID),
    {
      staleTime: Infinity,
    }
  );
};

export default useGetEmploymentSpecific;
