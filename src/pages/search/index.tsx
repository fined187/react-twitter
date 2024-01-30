import { useEffect, useState, useContext } from 'react'

import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '@/firebaseApp'
import AuthContext from '@/context/AuthContext'
import { PostProps } from '../home'
import PostBox from '@/components/post/PostBox'

export default function SearchPage() {
  const [posts, setPosts] = useState<PostProps[]>([])
  const [tagQuery, setTagQuery] = useState<string>('')
  const { user } = useContext(AuthContext)

  const onChange = (e: any) => {
    setTagQuery(e?.target?.value?.trim())
  }

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, 'posts')
      let postsQuery = query(
        postsRef,
        where('hashTags', 'array-contains-any', [tagQuery]),
        orderBy('createdAt', 'desc'),
      )

      onSnapshot(postsQuery, (snapShot) => {
        let dataObj = snapShot?.docs?.map((doc) => ({
          ...doc?.data(),
          id: doc?.id,
        }))

        setPosts(dataObj as PostProps[])
      })
    }
  }, [tagQuery, user])
  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">
          <div className="home__title-text">{}</div>
        </div>
        <div className="home__search-div">
          <input
            className="home__search"
            placeholder="태그를 검색해보세요 ex) #태그"
            onChange={onChange}
          />
        </div>
      </div>
      <div className="post">
        {posts?.length > 0 ? (
          posts?.map((post) => <PostBox post={post} key={post.id} />)
        ) : (
          <div className="post__no-posts">
            <div className="post__text">게시글이 없습니다</div>
          </div>
        )}
      </div>
    </div>
  )
}
