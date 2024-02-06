import AuthContext from '@/context/AuthContext'
import { db } from '@/firebaseApp'
import { PostProps } from '@/pages/home'
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { useCallback, useContext, useEffect, useState } from 'react'

interface FollowingBoxProps {
  post: PostProps
}

interface UserProps {
  id: string
}

export default function FollowingBox({ post }: FollowingBoxProps) {
  const { user } = useContext(AuthContext)
  const [postFollowers, setPostFollowers] = useState<any>([]) // [user1, user2, user3, ...
  const onClickFollow = async (e: any) => {
    e.preventDefault()
    try {
      if (user?.uid) {
        //  내가 주체가 되어 '팔로잉'콜렉션 생성 or 업데이트
        const followingRef = doc(db, 'following', user?.uid)
        await setDoc(
          followingRef,
          {
            users: arrayUnion({ id: post?.uid }),
          },
          { merge: true },
        )
        //  팔로우 당한느 사람이 주체가 되어 '팔로우' 콜렉션 생성 or 업데이트
        const followerRef = doc(db, 'followers', post?.uid)
        await setDoc(
          followerRef,
          {
            users: arrayUnion({ id: user?.uid }),
          },
          { merge: true },
        )
      }
      //  팔로우 알림
      await addDoc(collection(db, 'notifications'), {
        createdAt: new Date()?.toLocaleDateString('ko', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        content: `${user?.email || user?.displayName}님이 팔로우를 시작했습니다.`,
        uid: post?.uid,
        isRead: false,
        url: '#',
      })

      window.alert('팔로우를 완료했습니다.')
    } catch (error) {
      console.log(error)
    }
  }

  const onClickDeleteFollow = async (e: any) => {
    e.preventDefault()
    try {
      if (user?.uid) {
        const followingRef = doc(db, 'following', user?.uid)
        await updateDoc(followingRef, {
          users: arrayRemove({ id: post?.uid }),
        })
        const followerRef = doc(db, 'followers', post?.uid)
        await updateDoc(followerRef, {
          users: arrayRemove({ id: user?.uid }),
        })
      }
      window.alert('팔로우를 취소했습니다.')
    } catch (error) {
      console.log(error)
    }
  }

  const getFollowers = useCallback(async () => {
    if (post?.uid) {
      const ref = doc(db, 'followers', post?.uid)
      onSnapshot(ref, (doc) => {
        setPostFollowers([])
        doc
          .data()
          ?.users?.map((user: UserProps) =>
            setPostFollowers((prev: UserProps[]) =>
              prev ? [...prev, user?.id] : [],
            ),
          )
      })
    }
  }, [post?.id])

  useEffect(() => {
    if (post?.uid) {
      getFollowers()
    }
  }, [getFollowers, post?.uid])
  return (
    <>
      {user?.uid !== post?.uid &&
        (postFollowers?.includes(user?.uid) ? (
          <button className="post__following-btn" onClick={onClickDeleteFollow}>
            Following
          </button>
        ) : (
          <button className="post__follow-btn" onClick={onClickFollow}>
            Follow
          </button>
        ))}
    </>
  )
}
