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
