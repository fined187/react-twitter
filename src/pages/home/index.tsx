export interface PostProps {
  id: string
  email: string
  content: string
  createdAt: string
  uid: string
}

const posts: PostProps[] = [
  {
    id: '1',
    email: 'test@test.com',
    content: 'Test content',
    createdAt: '2021-01-01',
    uid: '1',
  },
  {
    id: '2',
    email: 'test@test.com',
    content: 'Test content',
    createdAt: '2021-01-01',
    uid: '1',
  },
  {
    id: '3',
    email: 'test@test.com',
    content: 'Test content',
    createdAt: '2021-01-01',
    uid: '1',
  },
  {
    id: '4',
    email: 'test@test.com',
    content: 'Test content',
    createdAt: '2021-01-01',
    uid: '1',
  },
  {
    id: '5',
    email: 'test@test.com',
    content: 'Test content',
    createdAt: '2021-01-01',
    uid: '1',
  },
]

export default function HomePage() {
  return (
    <div className="home">
      <div className="home__title">Home</div>
      <div className="home__tabs">
        <div className="home__tab home__tab--active">For you</div>
        <div className="home__tab">Following</div>
      </div>
      <form className="post-form">
        <textarea
          className="post-form__textarea"
          required
          name="content"
          id="content"
          placeholder="What's happening?"
        />
        <div className="post-form__submit-area">

        </div>
      </form>
    </div>
  )
}
