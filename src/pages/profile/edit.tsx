import PostHeader from '@/components/post/Header'
import AuthContext from '@/context/AuthContext'
import { storage } from '@/firebaseApp'
import { v4 as uuidv4 } from 'uuid'
import { useContext, useEffect, useState } from 'react'
import { FiImage } from 'react-icons/fi'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from 'firebase/storage'
import { updateProfile } from 'firebase/auth'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export default function ProfileEdit() {
  const [displayName, setDisplayName] = useState<string | null>('')
  const [imageUrl, setImageUrl] = useState<string | null>('')
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setDisplayName(value)
  }
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e
    const file = files?.[0]
    const fileReader = new FileReader()
    fileReader?.readAsDataURL(file!)
    fileReader.onloadend = (e: any) => {
      const { result } = e.currentTarget
      setImageUrl(result)
    }
  }
  const handleDeleteImg = () => {
    setImageUrl('')
  }

  useEffect(() => {
    if (user?.photoURL) {
      setImageUrl(user?.photoURL)
    }
    setDisplayName(user?.displayName || '')
  }, [user?.photoURL, user?.displayName])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let key = `${user?.uid}/${uuidv4()}`
    const storageRef = ref(storage, key)
    let newImageUrl = ''

    try {
      //  기존 이미지 항상 삭제
      if (user?.photoURL) {
        const imageRef = ref(storage, user?.photoURL)
        if (imageRef) {
          await deleteObject(imageRef).catch((error) => console.error(error))
        }
      }
      //  이미지 업로드
      if (imageUrl) {
        const data = await uploadString(storageRef, imageUrl, 'data_url')
        newImageUrl = await getDownloadURL(data.ref)
      }
      //  updateProfile 호출
      if (user) {
        await updateProfile(user, {
          displayName: displayName || '',
          photoURL: newImageUrl || '',
        })
          .then(() => {
            toast.success('프로필이 수정되었습니다.')
            navigate('/profile')
          })
          .catch((error) => {
            console.error(error)
            toast.error('프로필 수정에 실패했습니다.')
          })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="post">
      <PostHeader />
      <form className="post-form" onSubmit={onSubmit}>
        <div className="post-form__profile">
          <input
            type="text"
            name="displayName"
            className="post-form__input"
            placeholder="이름"
            onChange={onChange}
            value={displayName || ''}
          />
          {imageUrl && (
            <div className="post-form__attachment">
              <img
                src={imageUrl}
                alt="attachment"
                width={100}
                height={100}
                className="post-form__attachment"
              />
              <button
                type="button"
                onClick={handleDeleteImg}
                className="post-form__clear-btn"
              >
                삭제
              </button>
            </div>
          )}
          <div className="post-form__submit-area">
            <div className="post-form__image-area">
              <label className="post-form__file" htmlFor="file-input">
                <FiImage className="post-form__file-icon" />
              </label>
            </div>
            <input
              type="file"
              name="file"
              id="file-input"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <input
              type="submit"
              value="프로필 수정"
              className="post-form__submit-btn"
            />
          </div>
        </div>
      </form>
    </div>
  )
}
