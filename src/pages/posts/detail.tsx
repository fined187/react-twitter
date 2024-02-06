import Loader from '@/components/loader/Loader'
import PostBox from '@/components/post/PostBox'
import { db } from '@/firebaseApp'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PostProps } from '../home'
import { IoIosArrowBack } from 'react-icons/io'
import PostHeader from '@/components/post/Header'
import CommentForm from '@/components/comments/CommentForm'
import CommentBox, { CommentProps } from '@/components/comments/CommentBox'

export default function PostDetail() {
  const params = useParams<{ id: string }>()
  const [post, setPost] = useState<PostProps | null>(null)
  const navigate = useNavigate()

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, 'posts', params.id)
      onSnapshot(docRef, (doc) => {
        setPost({ ...(doc?.data() as PostProps), id: doc?.id })
      })
    }
  }, [params.id])
  useEffect(() => {
    if (params.id) {
      getPost()
    }
  }, [getPost, params.id])
  return (
    <div className="post">
      <PostHeader />
      {post ? (
        <>
          <PostBox post={post} />
          <CommentForm post={post} />
          {post?.comments
            ?.slice(0)
            .reverse()
            .map((data: CommentProps, index: number) => (
              <CommentBox key={index} data={data} post={post} />
            ))}
        </>
      ) : (
        <Loader />
      )}
    </div>
  )
}
