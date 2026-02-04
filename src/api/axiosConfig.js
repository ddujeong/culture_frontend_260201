import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8888/api", // 諛깆뿏�� 湲곕낯 URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // �몄뀡 �몄쬆�� �꾩슂�� 寃쎌슦
});
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token"); // �ш린�� �먮룞�쇰줈 媛��몄샂
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );
export default api;