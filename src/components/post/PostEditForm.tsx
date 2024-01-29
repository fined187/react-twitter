import { db } from '@/firebaseApp'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'
import { FiImage } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { PostProps } from './PostBox'

export default function PostEditForm() {
  const params = useParams<{ id: string }>()
  const [post, setPost] = useState<any>(null)
  const [content, setContent] = useState<string>('')
  const navigate = useNavigate()
  const [hashtag, setHashtag] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])

  const handleFileUpload = () => {}

  const getPost = useCallback(async () => {
    if (!params.id) return
    const docRef = doc(db, 'posts', params.id)
    const docSnap = await getDoc(docRef)
    setPost({ ...(docSnap?.data() as PostProps), id: docSnap?.id })
    setContent(docSnap?.data()?.content)
    setTags(docSnap?.data()?.hashTags)
  }, [params.id])
  const onSubmit = async (e: any) => {
    e.preventDefault()
    try {
      if (post) {
        const postRef = doc(db, 'posts', post.id)
        await updateDoc(postRef, {
          content: content,
          updatedAt: new Date(),
        })
        navigate(`/posts/${post.id}`)
      }
      setContent('')
      toast.success('트윗이 수정되었습니다.')
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

  useEffect(() => {
    if (params.id) getPost()
  }, [getPost])

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
        <input type="submit" value="수정" className="post-form__submit-btn" />
      </div>
    </form>
  )
}
