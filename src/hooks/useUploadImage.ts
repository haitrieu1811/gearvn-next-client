import { useMutation } from '@tanstack/react-query'

import filesApis from '@/apis/files.apis'

export default function useUploadImage() {
  const uploadImageMutation = useMutation({
    mutationKey: ['uploadImage'],
    mutationFn: filesApis.uploadImage
  })

  return {
    uploadImageMutation
  }
}
