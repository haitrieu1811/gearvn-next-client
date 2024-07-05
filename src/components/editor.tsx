import MarkdownIt from 'markdown-it'
import dynamic from 'next/dynamic'
import 'react-markdown-editor-lite/lib/index.css'

import useUploadImage from '@/hooks/useUploadImage'

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false
})

const mdParser = new MarkdownIt()

type EditorProps = {
  value: string
  defaultValue?: string
  onChange?: ({ html, text }: { html: string; text?: string }) => void
}

export default function Editor({ value, defaultValue, onChange }: EditorProps) {
  const { uploadImageMutation } = useUploadImage()

  const handleUploadImage = async (file: File) => {
    const form = new FormData()
    form.append('image', file)
    const res = await uploadImageMutation.mutateAsync(form)
    const imageUrl = res.data.data.images[0].url
    return imageUrl
  }

  return (
    <MdEditor
      style={{ height: '500px' }}
      imageAccept='.jpg,.jpeg,.png,.webp,.svg'
      renderHTML={(text) => mdParser.render(text)}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      onImageUpload={handleUploadImage}
    />
  )
}
