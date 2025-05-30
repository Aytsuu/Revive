import { useMutation } from "@tanstack/react-query";
import { addCart } from "../rest_api/cartPOST";

export const useAddCart = () => {
  return useMutation({
    mutationFn: (data: Record<string, any>) => addCart(data) 
  })
}