import AuthContext from '@/context/AuthContext'
import { db, storage } from '@/firebaseApp'
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { useContext } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { FaRegComment, FaUserCircle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ref, deleteObject } from 'firebase/storage'
import FollowingBox from '../following/FollowingBox'

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
  imageUrl?: string
}

export default function PostBox({ post }: any) {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const imageRef = ref(storage, post?.imageUrl)

  const handleDelete = async () => {
    const confirm = window.confirm('해당 트윗을 삭제하시겠습니까?')
    if (!confirm) return
    //  스토리지 이미지 먼저 삭제
    if (post?.imageUrl) {
      try {
        await deleteObject(imageRef)
      } catch (error) {
        console.log(error)
      }
    }
    try {
      await deleteDoc(doc(db, 'posts', post?.id))
      toast.success('트윗이 삭제되었습니다.')
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  const handleEdit = () => {
    const confirm = window.confirm('해당 트윗을 수정하시겠습니까?')
    if (confirm) {
      try {
        navigate(`/posts/edit/${post?.id}`)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const toggleLike = async () => {
    const postRef = doc(db, 'posts', post?.id)

    //  사용자가 좋아요를 미리 한 경우 -> 좋아요 취소
    if (user?.uid && post?.likes?.includes(user?.uid)) {
      try {
        await updateDoc(postRef, {
          likes: arrayRemove(user?.uid),
          likeCount: post?.likeCount ? post?.likeCount - 1 : 0,
        })
      } catch (error) {
        console.log(error)
      }
    } else {
      //  사용자가 좋아요를 미리 하지 않은 경우 -> 좋아요 추가
      await updateDoc(postRef, {
        likes: arrayUnion(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount + 1 : 1,
      })
    }
  }

  return (
    <div className="post__box" key={post?.id}>
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
          <div className="post__flex--between">
            <div className="post__flex">
              <div className="post__email">{post?.email}</div>
              <div className="post__createdAt">{post?.createdAt}</div>
            </div>
            <FollowingBox post={post} />
          </div>
        </div>
        <Link to={`/posts/${post?.id}`} className="post__link">
          <div className="post__box-content">{post?.content}</div>
          {post?.imageUrl && (
            <div className="post__image-div">
              <img
                src={post?.imageUrl}
                alt="post img"
                className="post__image"
                width={100}
                height={100}
              />
            </div>
          )}
          <div className="post-form__hashtags-outputs">
            {post?.hashTags?.map((tag: string, index: number) => (
              <span className="post-form__hashtags-tag" key={index}>
                #{tag}
              </span>
            ))}
          </div>
        </Link>
      </div>
      <div className="post__box-footer">
        {user?.uid === post?.uid && (
          <button type="button" className="post__delete" onClick={handleDelete}>
            Delete
          </button>
        )}
        <>
          <button type="button" className="post__edit" onClick={handleEdit}>
            <Link to={`/posts/edit/${post?.id}`}>Edit</Link>
          </button>
          <button type="button" className="post__likes" onClick={toggleLike}>
            {user && post?.likes?.includes(user?.uid) ? (
              <AiFillHeart className="post__likes-icon" />
            ) : (
              <AiOutlineHeart className="post__likes-icon" />
            )}
            {post?.likeCount || 0}
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
