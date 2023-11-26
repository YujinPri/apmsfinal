import useAxiosPrivate from "./useAxiosPrivate";
import { useQuery } from "react-query";

const useJobs = () => {
  const axiosPrivate = useAxiosPrivate();
  const getJobs = async () => {
    return await axiosPrivate.get("/selections/jobs/");
  };
  return useQuery("jobs-all", getJobs, {
    staleTime: Infinity,
  });
};

export default useJobs;
