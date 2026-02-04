import React, { useState } from "react";
import "../style/SignupForm.css"; // 아래 CSS 적용
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/axiosConfig";
import { useUser } from "../context/UserContext";

const SignupForm = () => {
  const navigate = useNavigate();
  const {login} = useUser();
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit =  async(e) => {
    e.preventDefault();
    try {
    // API 호출
    const response = await api.post("/users/signup", form);
    const savedUser = response.data; // 서버가 반환하는 User 객체
    console.log("회원가입 완료:", savedUser);

    login({
      id: savedUser.id,
      username: savedUser.username,
      email: savedUser.email,
    });
    // PreferencesPage로 이동, userId 전달
    navigate("/preferences");
  } catch (err) {
    console.error("회원가입 실패:", err);
    alert("회원가입 중 오류가 발생했습니다.");
  }
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
      </div>
    </div>
  );
};

export default SignupForm;
