import useAxiosPrivate from "./useAxiosPrivate";
import { useQuery } from "react-query";

const useGetAllEducations = () => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async () => {
    return await axiosPrivate.get("/uploads/educations/all");
  };
  return useQuery("educations-all", getData, {
    staleTime: Infinity,
  });
};

export default useGetAllEducations;
