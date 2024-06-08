import http from '@/lib/http'

const filesApis = {
  uploadImage(body: FormData) {
    return http.post('/v1/files/upload-image', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
} as const

export default filesApis
