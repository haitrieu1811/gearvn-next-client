import { useQuery } from '@tanstack/react-query'
import React from 'react'

import ordersApis from '@/apis/orders.apis'

export default function useAllOrders() {
  const getAllOrdersQuery = useQuery({
    queryKey: ['getAllOrders'],
    queryFn: () => ordersApis.getAllOrders()
  })

  const orders = React.useMemo(
    () => getAllOrdersQuery.data?.data.data.orders || [],
    [getAllOrdersQuery.data?.data.data.orders]
  )
  const analytics = React.useMemo(
    () => getAllOrdersQuery.data?.data.data.analytics,
    [getAllOrdersQuery.data?.data.data.analytics]
  )
  const totalOrder = React.useMemo(
    () => getAllOrdersQuery.data?.data.data.pagination.totalRows || 0,
    [getAllOrdersQuery.data?.data.data.pagination.totalRows]
  )

  return {
    getAllOrdersQuery,
    orders,
    analytics,
    totalOrder
  }
}
