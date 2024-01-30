import AuthContext from '@/context/AuthContext'
import { db, storage } from '@/firebaseApp'
import { addDoc, collection } from 'firebase/firestore'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { useContext, useState } from 'react'
import { FiImage } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

export default function PostForm() {
  const [content, setContent] = useState<string>('')
  const { user } = useContext(AuthContext)
  const [imageFile, setImageFile] = useState<string>('')
  const [hashtag, setHashtag] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e

    const file = files?.[0]
    const fileReader = new FileReader()
    fileReader?.readAsDataURL(file)

    fileReader.onloadend = (e: any) => {
      const { result } = e.currentTarget
      setImageFile(result)
    }
  }

  const handleDeleteImage = () => {
    setImageFile('')
  }

  const onSubmit = async (e: any) => {
    setIsSubmitting(true)
    const key = `${user?.uid}/${uuidv4()}`
    const storageRef = ref(storage, key)
    e.preventDefault()
    try {
      // 이미지 먼저 업로드
      let imageUrl = ''
      if (imageFile) {
        const data = await uploadString(storageRef, imageFile, 'data_url')
        imageUrl = await getDownloadURL(data?.ref)
      }
      await addDoc(collection(db, 'posts'), {
        content,
        createdAt: new Date()?.toLocaleDateString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        email: user?.email,
        uid: user?.uid,
        hashTags: tags,
        imageUrl: imageUrl,
      })
      setTags([])
      setHashtag('')
      setContent('')
      toast.success('트윗이 작성되었습니다.')
      setIsSubmitting(false)
      setImageFile('')
    } catch (error) {
      console.log(error)
    }
  }

  const handleKeyUp = (e: any) => {
    if (e.keyCode === 32 && e.target.value !== '') {
      if (tags?.includes(e.target.value.trim())) {
        toast.error('이미 추가된 태그입니다.')
      } else {
        setTags((prev) =>
          prev?.length > 0 ? [...prev, e.target.value] : [e.target.value],
        )
        setHashtag('')
      }
    }
  }

  const onChangeHashTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHashtag(e.target.value)
  }

  const removeTag = (tag: string) => {
    setTags((prev) => prev?.filter((t) => t !== tag))
  }

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e
    if (name === 'content') {
      setContent(value)
    }
  }

  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea
        className="post-form__textarea"
        required
        name="content"
        id="content"
        placeholder="What's happening?"
        onChange={onChange}
        value={content || ''}
      />
      <div className="post-form__hashtags">
        <span className="post-form__hashtags-output">
          {tags?.map((tag, index) => (
            <span
              className="post-form__hashtags-tag"
              key={index}
              onClick={() => removeTag(tag)}
            >
              #{tag}
            </span>
          ))}
        </span>
        <input
          className="post-form__input"
          name="hashtags"
          id="hashtags"
          placeholder="해시태그 + 스페이스바 입력"
          onChange={onChangeHashTag}
          onKeyUp={handleKeyUp}
          value={hashtag || ''}
        />
      </div>
      <div className="post-form__submit-area">
        <div className="post-form__image-area">
          <label htmlFor="file-input" className="post-form__file">
            <FiImage className="post-form__file-icon" />
          </label>
          <input
            type="file"
            name="file-input"
            id="file-input"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isSubmitting}
          />
          {imageFile && (
            <div className="post-form__attachment">
              <img src={imageFile} alt="attachment" width={100} height={100} />
              <button
                className="post-form__clear-btn"
                type="button"
                onClick={handleDeleteImage}
              >
                Clear
              </button>
            </div>
          )}
        </div>
        <input type="submit" value="Tweet" className="post-form__submit-btn" />
      </div>
    </form>
  )
}
