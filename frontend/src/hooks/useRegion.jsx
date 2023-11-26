import { useQuery } from "react-query";
import axios from "axios";

const getRegions = async () => {
  try {
    const response = await axios.get("https://psgc.gitlab.io/api/regions/", {
      headers: {
        accept: "text/html",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching regions:", error);
    throw error;
  }
};

const useRegions = () => {
  return useQuery("regions", getRegions, {
    staleTime: Infinity,
  });
};

export default useRegions;
