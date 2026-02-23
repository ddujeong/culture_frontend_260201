import React, { useState } from "react";
import "../style/SignupForm.css";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useUser } from "../context/UserContext";

const SignupForm = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/signup", form);
      const savedUser = response.data;

      login({
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
      });

      navigate("/preferences");
    } catch (err) {
      console.error("회원가입 실패:", err);
      if (err.response?.status === 409) {
        alert("이미 존재하는 이메일 또는 아이디입니다.");
      } else {
        alert("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  // 소셜 가입 핸들러
  const handleSocialSignup = (provider) => {
    console.log(`${provider}로 간편 가입 시도`);
    // window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <div className="signup-hero">
      <div className="signup-card">
        <h1>회원가입</h1>
        <p>계정을 만들어 나만의 추천을 받아보세요.</p>

        <form onSubmit={handleSubmit}>
          <input
            className="input-field"
            name="username"
            type="text"
            placeholder="아이디"
            value={form.username}
            onChange={handleChange}
            required
          />
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
          <button type="submit">가입하기</button>
        </form>

        {/* ✨ 소셜 회원가입 섹션 추가 */}
        <div className="social-divider">
          <span>또는 SNS 계정으로 가입</span>
        </div>

        <div className="social-group">
          <button
            type="button"
            className="social-btn google"
            onClick={() => handleSocialSignup('google')}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_Logo.svg" alt="Google" />
            Google로 가입하기
          </button>
          <button
            type="button"
            className="social-btn kakao"
            onClick={() => handleSocialSignup('kakao')}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg" alt="Kakao" />
            카카오톡으로 가입하기
          </button>
        </div>

        <div className="form-footer">
          <span>이미 계정이 있으신가요? </span>
          <button onClick={() => navigate("/login")} className="footer-link-btn">
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;