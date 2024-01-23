import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { app } from '@/firebaseApp'
import { toast } from 'react-toastify'

export default function SignupForm() {
  const [error, setError] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('')
  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const auth = getAuth(app)
      await createUserWithEmailAndPassword(auth, email, password)
      navigate('/')
      toast.success('회원가입이 완료되었습니다.')
    } catch (error: any) {
      console.log(error)
      toast.error(error?.code)
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e

    if (name === 'email') {
      setEmail(value)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        setError('이메일 형식이 올바르지 않습니다.')
      } else {
        setError('')
      }
    }

    if (name === 'password') {
      setPassword(value)

      if (value?.length < 8) {
        setError('비밀번호는 8자 이상이어야 합니다.')
      } else {
        setError('')
      }
    }

    if (name === 'password__confirmation') {
      setPasswordConfirmation(value)
      if (value !== password) {
        setError('비밀번호가 일치하지 않습니다.')
      } else if (value.length < 8) {
        setError('비밀번호는 8자 이상이어야 합니다.')
      } else {
        setError('')
      }
    }
  }

  return (
    <form className="form form--lg" onSubmit={onSubmit}>
      <div className="form__title">회원가입</div>
      <div className="form__block">
        <label htmlFor="email">이메일</label>
        <input
          type="text"
          id="email"
          name="email"
          value={email || ''}
          required
          onChange={onChange}
        />
      </div>
      <div className="form__block">
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password || ''}
          onChange={onChange}
          required
        />
      </div>
      <div className="form__block">
        <label htmlFor="password__confirmation">비밀번호 확인</label>
        <input
          type="password"
          id="password"
          name="password__confirmation"
          required
          value={passwordConfirmation || ''}
          onChange={onChange}
        />
      </div>
      {/* error? */}
      {error && error?.length > 0 && (
        <div className="form__block">
          <div className="form__error">contents</div>
        </div>
      )}
      <div className="form__block">
        계정이 있으신가요?
        <Link to="/users/login">로그인하기</Link>
      </div>
      <div className="form__block">
        <button
          type="submit"
          disabled={error.length > 0}
          className="form__btn-submit"
        >
          회원가입
        </button>
      </div>
    </form>
  )
}
