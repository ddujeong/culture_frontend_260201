import React from "react";
import "../style/RecommendationCard.css"; // 별도 CSS로 관리 추천
import { useNavigate } from "react-router-dom";

const categoryStyles = {
  MOVIE: { color: "#ef4444", icon: "🎬" },
  DRAMA: { color: "#6366f1", icon: "📺" },
  ENTERTAINMENT: { color: "#f59e0b", icon: "🍱" },
  ANIMATION: { color: "#ec4899", icon: "🏮" },
  BOOK: { color: "#10b981", icon: "📚" },
};

const RecommendationCard = ({ item, category }) => {
  const navigate = useNavigate();
  // category가 소문자로 들어올 경우를 대비해 toUpperCase() 처리
  const safeCategory = category?.toUpperCase();
  const { color, icon } = categoryStyles[safeCategory] || { color: "#6366f1", icon: "✨" };

  const reasonStyleMap = {
    PREFERRED_GENRE: { label: "취향 기반", color: "#8b5cf6" },
    RECENT_ACTIVITY: { label: "최근 활동", color: "#3b82f6" },
    HIGH_RATING: { label: "평점 우수", color: "#f59e0b" },
    POPULAR: { label: "인기", color: "#6b7280" },
  };

  const reason = reasonStyleMap[item.reasonType];

  return (
    <div className="feature-card" onClick={() => navigate(`/items/${item.itemId}`)}>
      <div className="card-media">
        <img src={item.img || "https://via.placeholder.com/300x400"} alt={item.title} />
        <div className="card-score">⭐ {item.score?.toFixed(1)}</div>
        <div className="card-category-tag">{icon} {item.genre}</div>
      </div>

      <div className="card-content">
        <div className="feature-card-title">{item.title}</div>

        {/* reason이 있을 때만 렌더링되지만, 
            CSS의 margin-top: auto 덕분에 항상 바닥에 붙습니다 */}
        {reason && (
          <div className="card-reason">
            <span className="reason-badge" style={{ backgroundColor: reason.color }}>
              {reason.label}
            </span>
            <p className="reason-text">{item.reasonMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;