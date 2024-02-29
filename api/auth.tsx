import { useMutation, useQuery } from "@tanstack/react-query";
import ERDEAxios from "./ERDEAxios";

export interface Login {
  pharosUser: String,
  userPassword: String
}

export interface Register {
  userName?: String,
  userPassword?: String,
  repeatPassword?: String,
  partyGovid?: String,
  email?: String,
  phone?: String
}

export const useLogin = () => {
  const mutation = useMutation({
    mutationFn: (data: Login) => {
      return ERDEAxios.post("/autenticate/token", JSON.stringify(data));
    }
  });

  return mutation;
};

export const useRegister = () => {
  const mutation = useMutation({
    mutationFn: (data: Register) => {
      return ERDEAxios.post("/securityservice/register", JSON.stringify(data));
    }
  });

  return mutation;
};