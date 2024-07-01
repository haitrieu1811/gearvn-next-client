'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { CheckCircle, Loader, Loader2, NotepadText, PackageCheck, Truck, XCircle } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import ordersApis from '@/apis/orders.apis'
import { ORDER_BADGE, columns } from '@/app/(admin)/_columns/orders.columns'
import AnalyticsCard from '@/app/(admin)/_components/analytics-card'
import DataTable from '@/components/data-table'
import OrderDetail from '@/components/order-detail'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { OrderStatus } from '@/constants/enum'
import useOrder from '@/hooks/useOrder'

type AdminOrderContext = {
  setCurrentViewingOrderId: React.Dispatch<React.SetStateAction<string | null>>
  setCurrentDeletingOrderId: React.Dispatch<React.SetStateAction<string | null>>
}

const initialAdminOrderContext: AdminOrderContext = {
  setCurrentViewingOrderId: () => null,
  setCurrentDeletingOrderId: () => null
}

export const AdminOrderContext = React.createContext<AdminOrderContext>(initialAdminOrderContext)

const ORDER_SELECT = [
  {
    value: OrderStatus.WaitForConfirmation.toString(),
    label: 'Chờ xác nhận'
  },
  {
    value: OrderStatus.Confirmed.toString(),
    label: 'Đã xác nhận'
  },
  {
    value: OrderStatus.Delivering.toString(),
    label: 'Đang vận chuyển'
  },
  {
    value: OrderStatus.Delivered.toString(),
    label: 'Đã giao'
  },
  {
    value: OrderStatus.Cancelled.toString(),
    label: 'Đã hủy'
  }
] as const

export default function AdminOrder() {
  const [currentViewingOrderId, setCurrentViewingOrderId] = React.useState<string | null>(null)
  const [currentDeletingOrderId, setCurrentDeletingOrderId] = React.useState<string | null>(null)

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

  const analyticCards = React.useMemo(
    () => [
      {
        Icon: NotepadText,
        mainNumber: totalOrder,
        strongText: 'Tổng cộng',
        slimText: 'đơn hàng trên hệ thống'
      },
      {
        Icon: Loader,
        mainNumber: analytics?.totalWaitForConfirmation || 0,
        strongText: 'Chờ xác nhận',
        slimText: 'đơn hàng trên hệ thống'
      },
      {
        Icon: PackageCheck,
        mainNumber: analytics?.totalConfirmed || 0,
        strongText: 'Đã xác nhận',
        slimText: 'đơn hàng trên hệ thống'
      },
      {
        Icon: Truck,
        mainNumber: analytics?.totalDelivering || 0,
        strongText: 'Đang vận chuyển',
        slimText: 'đơn hàng trên hệ thống'
      },
      {
        Icon: CheckCircle,
        mainNumber: analytics?.totalDelivered || 0,
        strongText: 'Đã giao',
        slimText: 'đơn hàng trên hệ thống'
      },
      {
        Icon: XCircle,
        mainNumber: analytics?.totalCancelled || 0,
        strongText: 'Đã hủy',
        slimText: 'đơn hàng trên hệ thống'
      }
    ],
    [totalOrder, analytics]
  )

  const { order, getOrderDetailQuery } = useOrder({ orderId: currentViewingOrderId })

  const updateOrderStatusMutation = useMutation({
    mutationKey: ['updateOrderStatus'],
    mutationFn: ordersApis.updateOrderStatus,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getOrderDetailQuery.refetch()
      getAllOrdersQuery.refetch()
    }
  })

  const handleUpdateOrderStatus = (status: OrderStatus) => {
    if (!currentViewingOrderId) return
    updateOrderStatusMutation.mutate({ status, orderId: currentViewingOrderId })
  }

  const deleteOrderMutation = useMutation({
    mutationKey: ['deleteOrder'],
    mutationFn: ordersApis.deleteOrder,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getAllOrdersQuery.refetch()
    }
  })

  const handleDeleteOrder = () => {
    if (!currentDeletingOrderId) return
    deleteOrderMutation.mutate(currentDeletingOrderId)
  }

  return (
    <AdminOrderContext.Provider
      value={{
        setCurrentViewingOrderId,
        setCurrentDeletingOrderId
      }}
    >
      <div className='space-y-5'>
        <div className='grid grid-cols-12 gap-5'>
          {analyticCards.map((item, index) => (
            <div key={index} className='col-span-3'>
              <AnalyticsCard {...item} />
            </div>
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Danh sách đơn hàng</CardTitle>
            <CardDescription>Có {totalOrder} đơn hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={orders} searchField='_id' />
          </CardContent>
        </Card>
      </div>
      {/* VIEW ORDER DIALOG */}
      <Dialog
        open={!!currentViewingOrderId}
        onOpenChange={(value) => {
          if (!value) {
            setCurrentViewingOrderId(null)
          }
        }}
      >
        <DialogContent className='max-w-2xl max-h-screen overflow-y-auto'>
          <div className='pt-5 space-y-5'>
            <div className='flex items-center space-x-3'>
              <h3 className='font-semibold tracking-tight text-xl'>Cập nhật trạng thái đơn hàng</h3>
              {!!order && ORDER_BADGE[order.status]}
            </div>
            <div className='flex justify-end'>
              <Select
                defaultValue={order?.status.toString()}
                onValueChange={(value) => handleUpdateOrderStatus(Number(value))}
              >
                <SelectTrigger className='w-auto'>
                  <SelectValue placeholder='Trạng thái đơn hàng' />
                </SelectTrigger>
                <SelectContent align='end'>
                  {ORDER_SELECT.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {!!order && !getOrderDetailQuery.isLoading && <OrderDetail orderData={order} />}
          {getOrderDetailQuery.isLoading && (
            <div className='flex justify-center items-center py-10'>
              <Loader2 size={50} strokeWidth={1} className='animate-spin stroke-main' />
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* DELETE ORDER ALERT DIALOG */}
      <AlertDialog
        open={!!currentDeletingOrderId}
        onOpenChange={(value) => {
          if (!value) {
            setCurrentDeletingOrderId(null)
          }
        }}
      >
        <AlertDialogContent className='max-w-sm'>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn muốn xóa đơn hàng này?</AlertDialogTitle>
            <AlertDialogDescription>Đơn hàng sẽ không được khôi phục sau khi xóa.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteOrderMutation.isPending}>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction disabled={deleteOrderMutation.isPending} onClick={handleDeleteOrder}>
              {deleteOrderMutation.isPending && <Loader2 size={16} className='animate-spin mr-2' />}
              Tiếp tục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminOrderContext.Provider>
  )
}
