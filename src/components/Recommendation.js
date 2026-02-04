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
        ⭐ {item.score}
      </div>

      <div className="card-reason">{item.reason}</div>
    </div>
  );
};

export default RecommendationCard;
