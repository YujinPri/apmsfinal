import { useQuery } from "react-query";
import axios from "axios";

const getBarangays = async (citiesMunicipalitiesCode) => {
  try {
    const response = await axios.get(
      `https://psgc.gitlab.io/api/cities-municipalities/${citiesMunicipalitiesCode}/barangays/`,
      {
        headers: {
          accept: "text/html",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

const useBarangays = (citiesMunicipalitiesCode) => {
  return useQuery(
    ["barangays", citiesMunicipalitiesCode],
    () => getBarangays(citiesMunicipalitiesCode),
    {
      enabled: !!citiesMunicipalitiesCode, // The query will not run if regionCode is not provided
      staleTime: Infinity,
    }
  );
};

export default useBarangays;
