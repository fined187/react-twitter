import { Route, Routes, Navigate } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home Page</h1>} />
      <Route path="/posts" children={<h1>Posts Page</h1>} />
      <Route path="/posts/:id" children={<h1>Post Page</h1>} />
      <Route path="/posts/new" element={<h1>New Post Page</h1>} />
      <Route path="/posts/edit/:id" element={<h1>Post Edit Page</h1>} />
      <Route path="/profile" element={<h1>Profile Page</h1>} />
      <Route path="/profile/edit" element={<h1>Profile Edit Page</h1>} />
      <Route path="/notification" element={<h1>Notification Page</h1>} />
      <Route path="/search" element={<h1>Search Page</h1>} />
      <Route path="/users/login" element={<h1>Login Page</h1>} />
      <Route path="/users/signup" element={<h1>Sign up Page</h1>} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default App;
