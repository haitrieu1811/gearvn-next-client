import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import React from 'react'
import { toast } from 'sonner'

import permissionsApis from '@/apis/permissions.apis'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Switch } from '@/components/ui/switch'
import { RoleField } from '@/constants/enum'
import useAllRoles from '@/hooks/useAllRoles'
import { OnlyMessageResponse } from '@/types/utils.types'

type UpdatePermissionFormProps = {
  userId: string | null
  onAssignSuccess?: (data: AxiosResponse<OnlyMessageResponse, any>) => void
  onUnassignSuccess?: (data: AxiosResponse<OnlyMessageResponse, any>) => void
}

export default function UpdatePermissionForm({
  userId,
  onAssignSuccess,
  onUnassignSuccess
}: UpdatePermissionFormProps) {
  const queryClient = useQueryClient()

  const { allRoles } = useAllRoles()

  const productRoles = React.useMemo(
    () => allRoles.filter((role) => [RoleField.Product, RoleField.ProductCategory].includes(role.field)),
    [allRoles]
  )
  const postRoles = React.useMemo(
    () => allRoles.filter((role) => [RoleField.Post, RoleField.PostCategory].includes(role.field)),
    [allRoles]
  )
  const orderRoles = React.useMemo(() => allRoles.filter((role) => role.field === RoleField.Order), [allRoles])

  const accordionData = React.useMemo(
    () => [
      {
        value: 'product',
        headingName: 'Sản phẩm',
        content: productRoles
      },
      {
        value: 'post',
        headingName: 'Bài viết',
        content: postRoles
      },
      {
        value: 'order',
        headingName: 'Đơn hàng',
        content: orderRoles
      }
    ],
    [productRoles, postRoles, orderRoles]
  )

  const getPermissionsByUserId = useQuery({
    queryKey: ['getPermissionsByUserId', userId],
    queryFn: () => permissionsApis.getPermissionsByUserId({ userId: userId as string }),
    enabled: !!userId
  })

  const permissions = React.useMemo(
    () => getPermissionsByUserId.data?.data.data.permissions || [],
    [getPermissionsByUserId.data?.data.data.permissions]
  )

  const assignRoleForUserMutation = useMutation({
    mutationKey: ['assignRoleForUser'],
    mutationFn: permissionsApis.assignRoleForUser,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getPermissionsByUserId.refetch()
      queryClient.invalidateQueries({ queryKey: ['getPermissionsGroupByUser'] })
      onAssignSuccess && onAssignSuccess(data)
    }
  })

  const unassignRoleOfUserMutation = useMutation({
    mutationKey: ['unassignRoleOfUser'],
    mutationFn: permissionsApis.unassignRoleOfUser,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getPermissionsByUserId.refetch()
      queryClient.invalidateQueries({ queryKey: ['getPermissionsGroupByUser'] })
      onUnassignSuccess && onUnassignSuccess(data)
    }
  })

  const handleChangeSwitch = ({ value, roleId }: { value: boolean; roleId: string }) => {
    if (!userId) return
    const payload = { roleId, userId }
    if (value) {
      assignRoleForUserMutation.mutate(payload)
      return
    }
    unassignRoleOfUserMutation.mutate(payload)
  }

  return (
    <Accordion type='single' defaultValue='product' collapsible>
      {accordionData.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger className='capitalize'>{item.headingName}</AccordionTrigger>
          <AccordionContent>
            <div className='grid grid-cols-12 gap-5 py-5'>
              {item.content.map((role) => (
                <div key={role._id} className='col-span-6 flex items-start space-x-2'>
                  <Switch
                    checked={permissions.map((permission) => permission._id).includes(role._id)}
                    onCheckedChange={(value) => handleChangeSwitch({ value, roleId: role._id })}
                  />
                  <div className='flex-1'>
                    <h3 className='font-medium tracking-tight'>{role.name}</h3>
                    {!!role.description && <p className='text-muted-foreground text-xs'>{role.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
