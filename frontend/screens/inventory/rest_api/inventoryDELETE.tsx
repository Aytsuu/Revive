import { useMutation } from "@tanstack/react-query";
import { deleteProduct } from "../queries/inventoryDelete";

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: (prodId: string) => deleteProduct(prodId)
  })
}