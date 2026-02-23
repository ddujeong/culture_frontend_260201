import React, { useState, useEffect } from "react";
import "../style/SignupForm.css";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useUser } from "../context/UserContext";

const LoginForm = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [rememberEmail, setRememberEmail] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);

  // 1. 페이지 로드 시 저장된 아이디 불러오기
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setForm((prev) => ({ ...prev, email: savedEmail }));
      setRememberEmail(true);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 자동 로그인 여부를 함께 서버에 전달할 수 있음
      const response = await api.post("/users/login", {
        ...form,
        autoLogin,
      });

      const user = response.data;
      login(user);

      // 2. 아이디 저장 로직 실행
      if (rememberEmail) {
        localStorage.setItem("rememberedEmail", form.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      console.log("로그인 성공:", user);
      navigate("/");
    } catch (err) {
      console.error("로그인 실패:", err);
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleSocialLogin = (provider) => {
    // 나중에 OAuth2 주소로 연결 (예시)
    // window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
    console.log(`${provider} 로그인 시도`);
  };

  return (
    <div className="signup-hero">
      <div className="signup-card login-card">
        <h1>로그인</h1>
        <p>나만의 추천을 다시 만나보세요.</p>

        <form onSubmit={handleSubmit}>
          <input
            className="input-field"
            name="email"
            type="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="input-field"
            name="password"
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            required
          />

          {/* 아이디 저장 & 자동 로그인 */}
          <div className="login-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberEmail}
                onChange={(e) => setRememberEmail(e.target.checked)}
              />
              <span>아이디 저장</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={autoLogin}
                onChange={(e) => setAutoLogin(e.target.checked)}
              />
              <span>자동 로그인</span>
            </label>
          </div>

          <button type="submit" className="login-submit-btn">로그인</button>
        </form>

        {/* 소셜 로그인 구분선 */}
        <div className="social-divider">
          <span>또는</span>
        </div>

        {/* 소셜 로그인 버튼 그룹 */}
        <div className="social-group">
          <button
            type="button"
            className="social-btn google"
            onClick={() => handleSocialLogin('google')}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_Logo.svg" alt="Google" />
            Google로 시작하기
          </button>
          <button
            type="button"
            className="social-btn kakao"
            onClick={() => handleSocialLogin('kakao')}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg" alt="Kakao" />
            카카오톡으로 시작하기
          </button>
        </div>

        <div className="form-footer">
          <span>계정이 없으신가요? </span>
          <button onClick={() => navigate("/signup")} className="footer-link-btn">회원가입 하기</button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;