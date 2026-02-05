import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Contents from './pages/Contents';
import ContentDetail from './pages/ContentDetail';
import MyPage from './pages/MyPage';
import SignupForm from './pages/SignupForm';
import PreferencesPage from './pages/PreferencesPage';
import UserHome from './pages/UserHome';
import LoginForm from './pages/LoginForm';
import { UserProvider, useUser } from './context/UserContext';
import ItemDetail from './pages/ItemDetails';
import Header from './components/Header';

function App() {
  const { user } = useUser();
  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={user ? <UserHome /> : <Home />} />
      <Route path='/home' element={<UserHome />} />
      <Route path='/login' element={<LoginForm />} />
      <Route path='/contents' element={<Contents />} />
      <Route path="/contents/:category/:id" element={<ContentDetail />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/preferences" element={<PreferencesPage />} />
      <Route path="/items/:id" element={<ItemDetail />} />
    </Routes>  
    </>
  );
}

export default App;
