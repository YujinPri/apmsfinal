import useAxiosPrivate from "./useAxiosPrivate";
import { useQuery } from "react-query";

const useGetAllProfiles = () => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async () => {
    return await axiosPrivate.get("/uploads/profiles/all");
  };
  return useQuery("all-user-profiles", getData, {
    staleTime: Infinity,
  });
};

export default useGetAllProfiles;
