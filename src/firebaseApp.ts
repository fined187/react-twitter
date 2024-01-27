import { initializeApp, FirebaseApp, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

export let app: FirebaseApp

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MSG_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
}

try {
  app = getApp()
} catch (error) {
  app = initializeApp(firebaseConfig, 'app')
}

const firebase = initializeApp(firebaseConfig)

export const db = getFirestore(firebase)

export default firebase
