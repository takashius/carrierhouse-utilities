import { useMutation, useQuery } from "@tanstack/react-query";
import ERDEAxios from "./ERDEAxios";

export const useGetForm = (productCode: Number) => {
  const data = {
    companyCode: 10,
    companyNodeCode: 14,
    productCode: productCode,
    productNodeCode: 160
  }
  const query = useQuery<any>({
    queryKey: ["newProposal"],
    enabled: true,
    retry: true,
    queryFn: () => {
      return ERDEAxios.post("/proposalservice/newproposal", JSON.stringify(data));
    },
  });
  return query;
};

export const useSetForm = () => {
  const mutation = useMutation({
    mutationFn: (data: any) => {
      return ERDEAxios.post("/proposalservice/commitproposal", data);
    },
  });

  return mutation;
};