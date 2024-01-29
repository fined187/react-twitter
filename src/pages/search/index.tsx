import PostBox, { PostProps } from '@/components/post/PostBox'
import AuthContext from '@/context/AuthContext'
import { db } from '@/firebaseApp'
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { useContext, useEffect, useState } from 'react'

export default function SearchPage() {
  const [posts, setPosts] = useState<PostProps[]>([])
  const [tagQuery, setTagQuery] = useState<string>('')
  const { user } = useContext(AuthContext)

  const onChange = (e: any) => {
    setTagQuery(e.target.value.trim())
  }

  useEffect(() => {
    let postRef = collection(db, 'posts')
    let postsQuery = query(
      postRef,
      where('hashTags', 'array-contains-any', [tagQuery]),
      orderBy('createdAt', 'desc'),
    )
    onSnapshot(postsQuery, (snapshot) => {
      let dataObj = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc?.id,
      }))
      setPosts(dataObj as PostProps[])
    })
  }, [tagQuery])

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">
          <div className="home__title-text">Search</div>
        </div>
        <div className="home__search-div">
          <input
            className="home__search"
            placeholder="해시태그 검색"
            onChange={onChange}
          />
        </div>
      </div>
      <div className="post">
        {posts.length > 0 ? (
          posts?.map((post) => <PostBox post={post} key={post.id} />)
        ) : (
          <div className="post__no-posts">
            <div className="post__text">게시글이 없습니다.</div>
          </div>
        )}
      </div>
    </div>
  )
}
