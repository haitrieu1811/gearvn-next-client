const PATH = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CART: '/cart',
  ACCOUNT: '/account',
  ACCOUNT_ORDER: '/account/order',

  ADMIN: '/admin',
  ADMIN_USER: '/admin/user',
  ADMIN_USER_UPDATE: (userId: string) => `/admin/user/${userId}`,
  ADMIN_PRODUCT: '/admin/product',
  ADMIN_PRODUCT_UPDATE: (productId: string) => `/admin/product/${productId}`,
  ADMIN_POST: '/admin/post',
  ADMIN_POST_UPDATE: (postId: string) => `/admin/post/${postId}`,
  ADMIN_ORDER: '/admin/order',
  ADMIN_ORDER_DETAIL: (orderId: string) => `/admin/order/${orderId}`
} as const

export default PATH