import { app } from '@/firebaseApp'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { createContext, useEffect, useState } from 'react'

interface AuthProps {
  children: React.ReactNode
}

const AuthContext = createContext({
  user: null as User | null,
})

export const AuthContextProvider = ({ children }: AuthProps) => {
  const auth = getAuth(app)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
      } else {
        setCurrentUser(null)
      }
    })
  }, [auth])

  return (
    <AuthContext.Provider value={{ user: currentUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext