import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../style/Header.css";

const Header = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // 로그아웃 후 홈으로 이동
  };
console.log(user)
  return (
    <header className="app-header">
      <div className="logo">
        <Link to="/">CultureApp</Link>
      </div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/contents">Contents</Link>
        {user && <Link to="/mypage">MyPage</Link>}
      </nav>
      <div className="user-actions">
        {user ? (
          <>
            <span>{user.email} 님</span>
            <button onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <Link to="/login">로그인</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
