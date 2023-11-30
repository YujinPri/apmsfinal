import useAxiosPrivate from "./useAxiosPrivate";
import { useQuery } from "react-query";

const useGetEducationProfiles = () => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async () => {
    return await axiosPrivate.get(`/profiles/education/me`);
  };
  return useQuery(
    ["education-me"],
    () => getData(),
    {
      staleTime: Infinity,
    }
  );
};

export default useGetEducationProfiles;
