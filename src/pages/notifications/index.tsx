import NotificationBox from '@/components/notifications/NotificationBox'
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

export interface NotificationsProps {
  id: string
  uid: string
  url: string
  isRead: boolean
  createdAt: string
  content: string
}

export default function NotificationsPage() {
  const { user } = useContext(AuthContext)
  const [notifications, setNotifications] = useState<any>([])

  useEffect(() => {
    if (user) {
      let ref = collection(db, 'notifications')
      let notificationQuery = query(
        ref,
        where('uid', '==', user?.uid),
        orderBy('createdAt', 'desc'),
      )
      onSnapshot(notificationQuery, (snapShot) => {
        let dataObj = snapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        setNotifications(dataObj as NotificationsProps[])
      })
    }
  }, [user])

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">
          <div className="home__title-text">Notification</div>
        </div>
      </div>
      <div className="post">
        {notifications?.length > 0 ? (
          notifications.map((notification: NotificationsProps) => (
            <NotificationBox
              key={notification?.id}
              notification={notification}
            />
          ))
        ) : (
          <div className="post__no-posts">
            <div className="post__text">No notifications</div>
          </div>
        )}
      </div>
    </div>
  )
}
