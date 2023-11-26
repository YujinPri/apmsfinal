import useAxiosPrivate from "./useAxiosPrivate";
import { useQuery } from "react-query";

const useCourses = () => {
  const axiosPrivate = useAxiosPrivate();
  const getJobs = async () => {
    return await axiosPrivate.get("/selections/courses/");
  };
  return useQuery("courses", getJobs, {
    staleTime: Infinity,
  });
};

export default useCourses;
