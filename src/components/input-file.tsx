import toArray from 'lodash/toArray'
import React from 'react'
import { toast } from 'sonner'

type InputFileProps = {
  children: React.ReactNode
  onChange?: (file?: File[]) => void
  multiple?: boolean
  maxFileSize?: number
  className?: string
}

export default function InputFile({
  children,
  onChange,
  multiple = false,
  maxFileSize = 300 * 1024,
  className = ''
}: InputFileProps) {
  const inputFileRef = React.useRef<HTMLInputElement>(null)

  const handleUpload = () => {
    inputFileRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesFromLocal = e.target.files
    const _filesFromLocal = toArray(filesFromLocal)
    const isSizeValid = _filesFromLocal.every((file) => file.size < maxFileSize)
    const isValidFiles = _filesFromLocal.filter((file) => file.size < maxFileSize)
    if (!isSizeValid) toast.error(`Dung lượng file tối đa ${maxFileSize / 1024}KB`)
    onChange && onChange(isValidFiles)
  }

  return (
    <React.Fragment>
      <input
        hidden
        ref={inputFileRef}
        type='file'
        accept='.jpg,.jpeg,.png,.webp,.svg'
        onChange={handleFileChange}
        onClick={(e) => ((e.target as any).value = null)}
        multiple={multiple}
      />
      <div className={className} onClick={handleUpload}>
        {children}
      </div>
    </React.Fragment>
  )
}
