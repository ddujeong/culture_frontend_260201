import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Contents from './pages/Contents';
import ContentDetail from './pages/ContentDetail';
import MyPage from './pages/MyPage';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/contents' element={<Contents />} />
      <Route path="/contents/:category/:id" element={<ContentDetail />} />
      <Route path="/mypage" element={<MyPage />} />

    </Routes>  
  );
}

export default App;
