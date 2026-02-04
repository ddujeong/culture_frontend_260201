import { useState, useEffect } from "react";
import axios from "axios";
import "../style/PreferencesPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useUser } from "../context/UserContext";

const categories = ["MOVIE", "BOOK", "MUSIC"];

export default function PreferencesPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [items, setItems] = useState({
    MOVIE: [],
    BOOK: [],
    MUSIC: [],
  });

  const [selectedItems, setSelectedItems] = useState({
    MOVIE: [],
    BOOK: [],
    MUSIC: [],
  });

  // 백엔드에서 랜덤 아이템 불러오기
  useEffect(() => {
    categories.forEach(async (category) => {
      try {
        const res = await api.get(`/items/random?category=${category}&limit=5`);
        setItems((prev) => ({ ...prev, [category]: res.data }));
      } catch (err) {
        console.error(err);
      }
    });
  }, []);

  if (!user) {
    return <p>로그인 또는 회원가입 후 접근 가능합니다.</p>;
  }
  const toggleItem = (category, itemId) => {
    setSelectedItems((prev) => {
      const current = prev[category];
      const updated = current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId];
      return { ...prev, [category]: updated };
    });
  };

  const handleSubmit = async () => {
    // 선택한 아이템 기반으로 장르 저장
    const itemsIds = categories.flatMap((cat) =>
      items[cat]
        .filter((item) => selectedItems[cat].includes(item.id))
        .map((item) => item.id)
    );

    try {
      await api.post("/users/preferences", {
        userId: user.id,
        itemsIds,
      });
      alert("취향 저장 완료! 추천 페이지로 이동합니다.");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("취향 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="preferences-page">
      <h1>환영합니다, 사용자님!</h1>
      <p>마음에 드는 아이템을 선택해주세요</p>

      <div className="categories">
        {categories.map((cat) => (
          <div key={cat} className="category-card">
            <h2>{cat}</h2>
            <div className="items-grid">
              {items[cat].map((item) => (
                <div
                  key={item.id}
                  className={`item-card ${
                    selectedItems[cat].includes(item.id) ? "selected" : ""
                  }`}
                  onClick={() => toggleItem(cat, item.id)}
                >
                  <img src={item.img || "https://via.placeholder.com/120x150"} alt={item.title} />
                  <div className="item-card-title">{item.title}</div>
                  <div className="item-card-genre">{item.genre}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        취향 저장하고 추천받기
      </button>
    </div>
  );
}
