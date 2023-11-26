import { useQuery } from "react-query";
import axios from "axios";

const getCitiesMunicipalities = async (regionCode) => {
  try {
    const response = await axios.get(
      `https://psgc.gitlab.io/api/regions/${regionCode}/cities-municipalities/`,
      {
        headers: {
          accept: "text/html",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Cities and Municipalities:", error);
    throw error;
  }
};

const useCitiesMunicipalities = (regionCode) => {
  return useQuery(
    ["cities-municipalities", regionCode],
    () => getCitiesMunicipalities(regionCode),
    {
      enabled: !!regionCode, // The query will not run if regionCode is not provided
      staleTime: Infinity,
    }
  );
};

export default useCitiesMunicipalities;
