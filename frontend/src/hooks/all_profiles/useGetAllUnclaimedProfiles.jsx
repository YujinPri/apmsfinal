import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useGetAllUnclaimed = () => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async () => {
    return await axiosPrivate.get("/uploads/unclaimed/all");
  };
  return useQuery("unclaimed-all", getData, {
    staleTime: Infinity,
  });
};

export default useGetAllUnclaimed;
