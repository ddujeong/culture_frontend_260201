import React, { useState } from "react";
import "../style/SignupForm.css"; // 기존 CSS 그대로 재사용
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useUser } from "../context/UserContext";

const LoginForm = () => {
    const { setUser } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 로그인 API 호출
      const response = await api.post("/users/login", form);
      const user = response.data; // { id, email, username ... }
    setUser(user);
      console.log("로그인 성공:", user);

      // 👉 일단은 userId만 넘김 (Context 붙이기 전)
      navigate("/");
    } catch (err) {
      console.error("로그인 실패:", err);
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="signup-hero">
      <div className="signup-card">
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

          <button type="submit">로그인</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
