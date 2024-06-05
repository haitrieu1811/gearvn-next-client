'use client'

import React from 'react'

import isAuth from '@/hocs/isAuth'

export default isAuth(function Account() {
  return <div>Account</div>
})
