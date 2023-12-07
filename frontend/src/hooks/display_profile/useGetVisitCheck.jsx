import useAxiosPrivate from "../useAxiosPrivate";
import { useQuery } from "react-query";

const useGetVisitCheck = (username) => {
  const axiosPrivate = useAxiosPrivate();
  const getData = async (username) => {
    return await axiosPrivate.get(`/profiles/check/${username}`);
  };
  return useQuery(["visit-check", username], () => getData(username), {
    staleTime: Infinity,
  });
};

export default useGetVisitCheck;
