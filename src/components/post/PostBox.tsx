import { AiFillHeart } from 'react-icons/ai'
import { FaRegComment, FaUserCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'

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
  const handleDelete = () => {}
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
        {/* post.uid === user.uid 일 때 */}
        <>
          <button type="button" className="post__delete" onClick={handleDelete}>
            Delete
          </button>
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
