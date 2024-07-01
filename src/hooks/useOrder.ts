import { useQuery } from '@tanstack/react-query'
import React from 'react'

import ordersApis from '@/apis/orders.apis'

type UseOrderProps = {
  orderId: string | null
}

export default function useOrder({ orderId }: UseOrderProps) {
  const getOrderDetailQuery = useQuery({
    queryKey: ['getOrderDetail', orderId],
    queryFn: () => ordersApis.getOrderDetail(orderId as string),
    enabled: !!orderId
  })

  const order = React.useMemo(
    () => getOrderDetailQuery.data?.data.data.order,
    [getOrderDetailQuery.data?.data.data.order]
  )

  return { getOrderDetailQuery, order }
}
