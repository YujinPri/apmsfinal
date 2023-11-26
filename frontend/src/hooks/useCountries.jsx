import { useQuery } from "react-query";
import axios from "axios";

const getCountries = async () => {
  try {
    const response = await axios.get(
      `https://raw.githubusercontent.com/stefangabos/world_countries/master/data/countries/en/countries.json`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

const useCountries = () => {
  return useQuery(
    "countries",
    () => getCountries(),
    {
      staleTime: Infinity,
    }
  );
};

export default useCountries;
