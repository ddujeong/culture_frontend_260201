import React from "react";
import "../style/UserHome.css";
import { useNavigate } from "react-router-dom";

const categoryStyles = {
  MOVIE: { color: "#F87171", icon: "🎬" },
  BOOK: { color: "#34D399", icon: "📚" },
  MUSIC: { color: "#60A5FA", icon: "🎵" },
};

const RecommendationCard = ({ item, category }) => {
  const navigate = useNavigate();
  const { color, icon } = categoryStyles[category] || { color: "#fff", icon: "" };
  const reasonStyleMap = {
    PREFERRED_GENRE: { label: "취향 기반", color: "#A78BFA" },
    RECENT_ACTIVITY: { label: "최근 활동", color: "#60A5FA" },
    HIGH_RATING: { label: "평점 우수", color: "#FBBF24" },
    POPULAR: { label: "인기", color: "#9CA3AF" },
  };
  const reason = reasonStyleMap[item.reasonType];
  return (
    <div className="feature-card" onClick={() => navigate(`/items/${item.itemId}`)} style={{ borderColor: color }}>
      <img
        src={item.img || "https://via.placeholder.com/300x400"}
        alt={item.title}
      />
      <div className="feature-card-title">{item.title}</div>

      <div className="card-category" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
        {icon} {item.genre}
      </div>

      <div className="card-score" style={{ backgroundColor: color }}>
        ⭐ {item.score.toFixed(1)}
      </div>
      {reason && (
        <div className="card-reason">
          <span
            className="reason-badge"
            style={{ backgroundColor: reason.color }}
          >
            {reason.label}
          </span>
          <span className="reason-text">
            {item.reasonMessage}
          </span>
        </div>
      )}

    </div>
  );
};

export default RecommendationCard;
