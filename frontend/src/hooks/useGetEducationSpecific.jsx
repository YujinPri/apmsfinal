import useAxiosPrivate from "./useAxiosPrivate";
import { useQuery } from "react-query";

const useGetEducationSpecific = (educationID) => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async (educationID) => {
    return await axiosPrivate.get(
      `/profiles/education/${educationID}`
    );
  };
  return useQuery(
    ["education-profile-specific", educationID],
    () => getData(educationID),
    {
      staleTime: Infinity,
    }
  );
};

export default useGetEducationSpecific;
