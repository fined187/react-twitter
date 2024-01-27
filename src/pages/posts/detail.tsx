import Loader from '@/components/loader/Loader'
import PostBox from '@/components/post/PostBox'
import { db } from '@/firebaseApp'
import { doc, getDoc } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PostProps } from '../home'
import { IoIosArrowBack } from 'react-icons/io'

export default function PostDetail() {
  const params = useParams<{ id: string }>()
  const [post, setPost] = useState<PostProps | null>(null)
  const navigate = useNavigate()

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, 'posts', params.id)
      const docSnap = await getDoc(docRef)

      setPost({ ...(docSnap?.data() as PostProps), id: docSnap?.id })
    }
  }, [params.id])
  useEffect(() => {
    if (params.id) {
      getPost()
    }
  }, [getPost])
  return (
    <div className="post">
      <div className="post__header">
        <button type="button" onClick={() => navigate(-1)}>
          <IoIosArrowBack className="post__header-btn" />
        </button>
      </div>
      {post ? <PostBox post={post} /> : <Loader />}
    </div>
  )
}
