import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { app } from '@/firebaseApp'
import { toast } from 'react-toastify'

export default function LoginForm() {
  const [error, setError] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const auth = getAuth(app)
      await signInWithEmailAndPassword(auth, email, password)
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
  }

  const onClickSocialLogin = async (e: any) => {
    const {
      target: { name },
    } = e
    let provider
    const auth = getAuth(app)
    if (name === 'google') {
      provider = new GoogleAuthProvider()
    }
    if (name === 'github') {
      provider = new GithubAuthProvider()
    }
    await signInWithPopup(
      auth,
      provider as GithubAuthProvider | GoogleAuthProvider,
    )
      .then((result) => {
        console.log(result)
        toast.success('로그인이 완료되었습니다.')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <form className="form form--lg" onSubmit={onSubmit}>
      <div className="form__title">로그인</div>
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
        계정이 없으신가요?&nbsp;
        <Link to="/users/signup">회원가입</Link>
      </div>
      <div className="form__block--lg">
        <button
          type="submit"
          disabled={error.length > 0}
          className="form__btn--submit"
        >
          로그인
        </button>
      </div>
      <div className="form__block">
        <button
          type="button"
          name="google"
          disabled={error.length > 0}
          className="form__btn--google"
          onClick={async (e) => {
            await onClickSocialLogin(e)
          }}
        >
          Google로 로그인
        </button>
      </div>
      <div className="form__block">
        <button
          type="button"
          name="github"
          disabled={error.length > 0}
          className="form__btn--github"
          onClick={async (e) => {
            await onClickSocialLogin(e)
          }}
        >
          Github으로 로그인
        </button>
      </div>
    </form>
  )
}
