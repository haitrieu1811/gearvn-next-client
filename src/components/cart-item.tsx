import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import QuantityController from '@/components/quantity-controller'
import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'
import { formatCurrency } from '@/lib/utils'
import { CartItem as CartItemType } from '@/types/cart.types'

type CartItemProps = {
  cartItemData: CartItemType
  isPending: boolean
  handleUpdateCartItem: ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) => void
  handleDeleteCartItem: (cartItemId: string) => void
}

export default React.memo(function CartItem({
  cartItemData,
  isPending,
  handleUpdateCartItem,
  handleDeleteCartItem
}: CartItemProps) {
  const [quantity, setQuantity] = React.useState<number>(cartItemData.quantity)

  return (
    <div className='flex p-5 space-x-5'>
      <div className='flex flex-col items-center justify-center space-y-2'>
        <Link
          href={PATH.PRODUCT_DETAIL({ name: cartItemData.product.name, id: cartItemData.product._id })}
          className='border rounded-md p-1'
        >
          <Image
            width={100}
            height={100}
            src={cartItemData.product.thumbnail}
            alt={cartItemData.product.name}
            className='w-20 aspect-square object-cover rounded-md'
          />
        </Link>
        <Button
          size='sm'
          variant='link'
          className='text-muted-foreground h-auto p-0'
          onClick={() => handleDeleteCartItem(cartItemData._id)}
        >
          <Trash2 size={14} strokeWidth={1.5} className='mr-2' />
          Xóa
        </Button>
      </div>
      <div className='flex-1'>
        <Link
          href={PATH.PRODUCT_DETAIL({ name: cartItemData.product.name, id: cartItemData.product._id })}
          className='font-medium hover:underline'
        >
          {cartItemData.product.name}
        </Link>
      </div>
      <div className='flex flex-col items-end space-y-2'>
        <div className='text-main font-semibold'>{formatCurrency(cartItemData.product.priceAfterDiscount)}&#8363;</div>
        <div className='text-sm text-muted-foreground line-through'>
          {formatCurrency(cartItemData.product.originalPrice)}&#8363;
        </div>
        <QuantityController
          disabled={isPending}
          value={quantity}
          classNameButton='w-6'
          onChange={(value) => setQuantity(value)}
          onDecrease={(value) => {
            handleUpdateCartItem({ cartItemId: cartItemData._id, quantity: value })
            setQuantity(value)
          }}
          onIncrease={(value) => {
            handleUpdateCartItem({ cartItemId: cartItemData._id, quantity: value })
            setQuantity(value)
          }}
          onFocusOut={(value) => {
            handleUpdateCartItem({ cartItemId: cartItemData._id, quantity: value })
            setQuantity(value)
          }}
        />
      </div>
    </div>
  )
})
