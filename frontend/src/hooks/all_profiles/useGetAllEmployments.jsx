import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useGetAllEmployments = () => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async () => {
    return await axiosPrivate.get("/uploads/employments/all");
  };
  return useQuery("employments-all", getData, {
    staleTime: Infinity,
  });
};

export default useGetAllEmployments;
