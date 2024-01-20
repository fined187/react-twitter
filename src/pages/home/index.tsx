import PostForm from '@/components/post/PostForm'
import PostBox from '@/components/post/PostBox'
export interface PostProps {
  id: string
  email: string
  content: string
  createdAt: string
  uid: string
  profileUrl?: string
  likes?: string[]
  likeCount?: number
  comments?: any
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
      <PostForm />
      {/* Tweet Posts */}
      <div className="post">
        {posts?.map((post: any, idx: number) => (
          <PostBox post={post} key={idx} />
        ))}
      </div>
    </div>
  )
}
