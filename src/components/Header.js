import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../style/Header.css";

const Header = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <header className="app-header">
      <div className="logo">
        <Link to="/">CultureApp</Link>
      </div>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/list">Contents</Link>
        {user && <Link to="/mypage">MyPage</Link>}
      </nav>

      <div className="user-actions">
        {user ? (
          <>
            <span className="user-info">{user.nickname || user.email.split('@')[0]} 님</span>
            <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <Link to="/login" className="login-link">로그인</Link>
        )}
      </div>
    </header>
  );
};

export default Header;