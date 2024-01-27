import AuthContext from '@/context/AuthContext'
import { db } from '@/firebaseApp'
import { deleteDoc, doc } from 'firebase/firestore'
import { useContext } from 'react'
import { AiFillHeart } from 'react-icons/ai'
import { FaRegComment, FaUserCircle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export interface PostProps {
  id: string
  email: string
  content: string
  createdAt: string
  uid: string
  profileUrl?: string
  likes?: string[]
  likeCount?: number
  comments?: any
}

export default function PostBox({ post }: any) {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const handleDelete = async () => {
    const confirm = window.confirm('해당 트윗을 삭제하시겠습니까?')
    if (!confirm) return
    try {
      await deleteDoc(doc(db, 'posts', post?.id))
      toast.success('트윗이 삭제되었습니다.')
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="post__box" key={post?.id}>
      <Link to={`/posts/${post?.id}`} className="post__link">
        <div className="post__box-profile">
          <div className="post__flex">
            {post?.profileUrl ? (
              <img
                src={post?.profileUrl}
                alt="profile"
                className="post__box-profile-img"
              />
            ) : (
              <FaUserCircle className="post__box-profile-icon" />
            )}
            <div className="post__email">{post?.email}</div>
            <div className="post__createdAt">{post?.createdAt}</div>
          </div>
          <div className="post__box-content">{post?.content}</div>
        </div>
      </Link>
      <div className="post__box-footer">
        {user?.uid === post?.uid && (
          <button type="button" className="post__delete" onClick={handleDelete}>
            Delete
          </button>
        )}
        <>
          <button type="button" className="post__edit" onClick={handleDelete}>
            <Link to={`/posts/edit/${post?.id}`}>Edit</Link>
          </button>
          <button type="button" className="post__likes" onClick={handleDelete}>
            <Link to={`/posts/edit/${post?.id}`}>
              <AiFillHeart className="post__likes-icon" />
              {post?.likeCount || 0}
            </Link>
          </button>
          <button
            type="button"
            className="post__comments"
            onClick={handleDelete}
          >
            <Link to={`/posts/edit/${post?.id}`}>
              <FaRegComment className="post__comments-icon" />
              {post?.comments?.length || 0}
            </Link>
          </button>
        </>
      </div>
    </div>
  )
}
