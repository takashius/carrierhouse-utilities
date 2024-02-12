import { useQuery } from "@tanstack/react-query";
import ERDEAxios from "./ERDEAxios";

export const useLogin = (pharosUser: String, userPassword: String) => {
  const query = useQuery<string>({
    queryKey: ["login"],
    enabled: false,
    retry: false,
    queryFn: () => {
      return ERDEAxios.post("/autenticate/token", JSON.stringify({ pharosUser, userPassword }));
    },
  });
  return query;
};