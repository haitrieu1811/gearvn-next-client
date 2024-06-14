import { AxiosError, HttpStatusCode, isAxiosError } from 'axios'
import { clsx, type ClassValue } from 'clsx'
import isEmpty from 'lodash/isEmpty'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

import { ErrorResponse } from '@/types/utils.types'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (currency: number) => {
  return new Intl.NumberFormat('de-DE').format(currency)
}

export const isEntityError = <Error>(error: unknown): error is AxiosError<Error> => {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export const isUnauthorizedError = <Error>(error: unknown): error is AxiosError<Error> => {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export const isExpiredError = <UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> => {
  return isUnauthorizedError<ErrorResponse<{}>>(error) && error.response?.data.message === 'Jwt expired'
}

export const handleErrorsFromServer = <FormSchema>({
  form,
  errors
}: {
  form: UseFormReturn<FieldValues & FormSchema, any, undefined>
  errors: Error
}) => {
  if (isEntityError<ErrorResponse<Record<keyof FormSchema, string>>>(errors)) {
    const formErrors = errors.response?.data.errors
    if (!isEmpty(formErrors)) {
      Object.keys(formErrors).forEach((key) => {
        form.setError(key as Path<FieldValues & FormSchema>, {
          message: formErrors[key as keyof FormSchema],
          type: 'Server'
        })
      })
    }
  }
}

export const convertMomentToVietnamese = (timeString: string): string => {
  return timeString
    .replace('a few seconds ago', 'vài giây trước')
    .replace('seconds ago', 'giây trước')
    .replace('a minute ago', '1 phút trước')
    .replace('minutes ago', 'phút trước')
    .replace('an hour ago', '1 giờ trước')
    .replace('hours ago', 'giờ trước')
    .replace('a day ago', '1 ngày trước')
    .replace('days ago', 'ngày trước')
    .replace('a month ago', '1 tháng trước')
    .replace('months ago', 'tháng trước')
    .replace('a year ago', '1 năm trước')
    .replace('years ago', 'năm trước')
}

const removeSpecialCharacter = (text: string): string => {
  text = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  text = text.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  return text
}

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i-${id}`
}

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i-')
  return arr[arr.length - 1]
}

export const formatNumberToSocialStyle = (number: number) => {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(number)
    .replace('.', ',')
    .toLocaleLowerCase()
}

export const rateSale = (originalPrice: number, salePrice: number) => {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

export const numberEnumToArray = (numberEnum: { [key: string]: string | number }) => {
  return Object.values(numberEnum).filter((item) => typeof item === 'number') as number[]
}
