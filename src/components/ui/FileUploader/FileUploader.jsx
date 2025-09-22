import './FileUploader.css'
import { useCallback, useRef, useState } from 'react'

const ACCEPT = '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

export default function FileUploader({ onFiles, accept = ACCEPT, multiple = false, className = '' }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = useCallback((files) => {
    if (!files || files.length === 0) return
    const list = multiple ? Array.from(files) : [files[0]]
    onFiles && onFiles(list)
  }, [multiple, onFiles])

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }
  const onDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const onDragLeave = () => setDragOver(false)
  const onPick = () => inputRef.current?.click()
  const onChange = (e) => handleFiles(e.target.files)

  return (
    <div
      className={`file-uploader ${dragOver ? 'drag-over' : ''} ${className}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={onPick}
      role="button"
      tabIndex={0}
    >
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={onChange} hidden />
      <div className="hint">Drag and drop files here, or click to browse</div>
    </div>
  )
}

