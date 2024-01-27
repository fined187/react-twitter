import AuthContext from '@/context/AuthContext'
import { db } from '@/firebaseApp'
import { addDoc, collection } from 'firebase/firestore'
import { useContext, useState } from 'react'
import { FiImage } from 'react-icons/fi'
import { toast } from 'react-toastify'

export default function PostForm() {
  const [content, setContent] = useState<string>('')
  const { user } = useContext(AuthContext)
  const handleFileUpload = () => {}
  const onSubmit = async (e: any) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'posts'), {
        content,
        createdAt: new Date()?.toLocaleDateString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        email: user?.email,
        uid: user?.uid,
      })
      setContent('')
      toast.success('트윗이 작성되었습니다.')
    } catch (error) {
      console.log(error)
    }
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
      <div className="post-form__submit-area">
        <label htmlFor="file-input" className="post-form__file">
          <FiImage className="post-form__file-icon" />
        </label>
        <input
          type="file"
          name="file-input"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <input type="submit" value="Tweet" className="post-form__submit-btn" />
      </div>
    </form>
  )
}
