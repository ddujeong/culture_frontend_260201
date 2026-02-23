import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useUser } from "../context/UserContext";
import "../style/PreferencesPage.css";

// 백엔드 Enum과 일치하는 6개 카테고리
const categories = ["MOVIE", "DRAMA", "TV_SHOW", "ANIMATION", "BOOK", "MUSIC"];

// 표시용 한글 레이블
const categoryLabels = {
  MOVIE: "영화",
  DRAMA: "드라마",
  TV_SHOW: "예능",
  ANIMATION: "애니메이션",
  BOOK: "도서",
  MUSIC: "음악"
};

export default function PreferencesPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  // 모든 카테고리를 빈 배열로 초기화
  const [items, setItems] = useState(
    categories.reduce((acc, cat) => ({ ...acc, [cat]: [] }), {})
  );

  const [selectedItems, setSelectedItems] = useState(
    categories.reduce((acc, cat) => ({ ...acc, [cat]: [] }), {})
  );

  useEffect(() => {
    if (!user) return;

    const fetchAllItems = async () => {
      const promises = categories.map(cat => {
        // 영상 콘텐츠는 12개, 나머지는 8개 정도로 차등을 둠
        const limit = ["MOVIE", "DRAMA", "ANIMATION"].includes(cat) ? 12 : 8;
        return api.get(`/items/random?category=${cat}&limit=${limit}`).catch(() => ({ data: [] }));
      });

      const results = await Promise.all(promises);
      const newItems = {};
      results.forEach((res, index) => {
        newItems[categories[index]] = res.data;
      });
      setItems(newItems);
    };

    fetchAllItems();
  }, [user]);

  if (!user) {
    return <div className="loading-box">로그인 후 접근 가능합니다.</div>;
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
    // 모든 카테고리에서 선택된 ID 합치기
    const itemsIds = categories.flatMap((cat) => selectedItems[cat]);

    if (itemsIds.length === 0) {
      alert("최소 한 개 이상의 아이템을 선택해주세요!");
      return;
    }

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
      <header className="pref-header">
        <h1>환영합니다, {user?.username || '사용자'}님!</h1>
        <p>평소에 즐겨보거나 마음에 드는 아이템을 선택해주세요 (다중 선택 가능)</p>
      </header>

      <div className="categories-container">
        {categories.map((cat) => (
          <div key={cat} className="category-section">
            <h2 className="category-title">{categoryLabels[cat]}</h2>
            <div className="items-grid">
              {(items[cat] || []).map((item) => (
                <div
                  key={item.id}
                  className={`pref-item-card ${selectedItems[cat].includes(item.id) ? "selected" : ""}`}
                  onClick={() => toggleItem(cat, item.id)}
                >
                  <div className="img-wrapper">
                    <img src={item.img || "https://via.placeholder.com/150x210"} alt={item.title} />
                    {selectedItems[cat].includes(item.id) && <div className="check-overlay">✔</div>}
                  </div>
                  <div className="item-info">
                    <div className="item-title">{item.title}</div>
                    <div className="item-genre">{item.genre}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="footer-action">
        <button className="submit-btn" onClick={handleSubmit}>
          {categories.flatMap(cat => selectedItems[cat]).length}개 선택 완료 & 추천받기
        </button>
      </div>
    </div>
  );
}