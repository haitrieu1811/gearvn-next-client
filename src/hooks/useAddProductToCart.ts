import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { toast } from 'sonner'

import cartApis from '@/apis/cart.apis'
import { AddProductToCartResponse } from '@/types/cart.types'

type UseAddProductToCartProps = {
  onSuccess?: (data: AxiosResponse<AddProductToCartResponse, any>) => void
}

export default function useAddProductToCart({ onSuccess }: UseAddProductToCartProps) {
  const queryClient = useQueryClient()

  const addProductToCartMutation = useMutation({
    mutationKey: ['addProductToCart'],
    mutationFn: cartApis.addProductToCart,
    onSuccess: (data) => {
      toast.success(data.data.message)
      queryClient.invalidateQueries({ queryKey: ['getMyCart'] })
      onSuccess && onSuccess(data)
    }
  })

  const handleAddProductToCart = ({ productId, quantity }: { productId: string; quantity: number }) => {
    addProductToCartMutation.mutate({ productId, quantity })
  }

  return {
    addProductToCartMutation,
    handleAddProductToCart
  }
}
