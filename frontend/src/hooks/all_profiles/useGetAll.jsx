import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useGetAll = () => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async () => {
    return await axiosPrivate.get("/uploads/all/");
  };
  return useQuery("all", getData, {
    staleTime: Infinity,
  });
};

export default useGetAll;
