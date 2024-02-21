import { useMutation, useQuery } from "@tanstack/react-query";
import ERDEAxios from "./ERDEAxios";

export const usePartyStructure = () => {
  const mutation = useMutation<any>({
    mutationFn: () => {
      return ERDEAxios.post("/partyservice/partystructure");
    }
  });

  return mutation;
};

export const usePartyDeclarations = () => {
  const mutation = useMutation<any>({
    mutationFn: () => {
      return ERDEAxios.post("/partyservice/declarations", { partyRelationship: 8 });
    },
  });

  return mutation;
};