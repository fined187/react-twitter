import { db } from '@/firebaseApp'
import { NotificationsProps } from '@/pages/notifications'
import { doc, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import styles from './Notification.module.scss'

export default function NotificationBox({
  notification,
}: {
  notification: NotificationsProps
}) {
  const navigate = useNavigate()
  const onClickNotification = async (url: string) => {
    //  isRead = true
    const ref = doc(db, 'notifications', notification.id)
    await updateDoc(ref, {
      isRead: true,
    })
    navigate(url)
  }
  return (
    <div key={notification?.id} className={styles.notification}>
      <div onClick={() => onClickNotification(notification?.url)}>
        <div className={styles.notification__flex}>
          <div className={styles.notification__createdAt}>
            {notification?.createdAt}
          </div>
          {notification?.isRead === false && (
            <div className={styles.notification__unread} />
          )}
        </div>
        <div className={styles.notification__content}>
          {notification?.content}
        </div>
      </div>
    </div>
  )
}
