import { useQuery } from '@tanstack/react-query'
import React from 'react'

import addressesApis from '@/apis/addresses.apis'

export default function useMyAddresses() {
  const getMyAddressesQuery = useQuery({
    queryKey: ['getMyAddresses'],
    queryFn: () => addressesApis.getMyAddresses()
  })

  const myAddresses = React.useMemo(
    () => getMyAddressesQuery.data?.data.data.addresses || [],
    [getMyAddressesQuery.data?.data.data.addresses]
  )
  const totalMyAddreses = React.useMemo(
    () => getMyAddressesQuery.data?.data.data.pagination.totalRows || 0,
    [getMyAddressesQuery.data?.data.data.pagination.totalRows]
  )

  return {
    getMyAddressesQuery,
    myAddresses,
    totalMyAddreses
  }
}
