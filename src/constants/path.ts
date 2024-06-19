import { generateNameId } from '@/lib/utils'

const PATH = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CART: '/cart',
  ACCOUNT: '/account',
  ACCOUNT_ORDER: '/account/order',
  ACCOUNT_ADDRESS: '/account/address',
  ACCOUNT_PASSWORD: '/account/password',
  PRODUCT: '/product',
  PRODUCT_DETAIL: ({ name, id }: { name: string; id: string }) => `/product/${generateNameId({ name, id })}`,
  POST_DETAIL: ({ name, id }: { name: string; id: string }) => `/post/${generateNameId({ name, id })}`,

  ADMIN: '/admin',
  ADMIN_USER: '/admin/user',
  ADMIN_USER_UPDATE: (userId: string) => `/admin/user/${userId}`,
  ADMIN_PRODUCT_CATEGORY: '/admin/product-category',
  ADMIN_BRAND: '/admin/brand',
  ADMIN_PRODUCT: '/admin/product',
  ADMIN_PRODUCT_NEW: '/admin/product/new',
  ADMIN_PRODUCT_UPDATE: (productId: string) => `/admin/product/${productId}`,
  ADMIN_POST: '/admin/post',
  ADMIN_POST_NEW: '/admin/post/new',
  ADMIN_POST_UPDATE: (postId: string) => `/admin/post/${postId}`,
  ADMIN_ORDER: '/admin/order',
  ADMIN_ORDER_DETAIL: (orderId: string) => `/admin/order/${orderId}`,
  ADMIN_ROLE: '/admin/role',
  ADMIN_PERMISSION: '/admin/permission'
} as const

export default PATH
