import useAxiosPrivate from "./useAxiosPrivate";
import { useQuery } from "react-query";

const useClassifications = () => {
  const axiosPrivate = useAxiosPrivate();
  const getJobs = async () => {
    return await axiosPrivate.get("/selections/classifications/");
  };
  return useQuery("classifications-all", getJobs, {
    staleTime: Infinity,
  });
};

export default useClassifications;