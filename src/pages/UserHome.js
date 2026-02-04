// UserHome.jsx
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "../style/Home.css";
import { useUser } from "../context/UserContext";

import React from "react";
import "../style/UserHome.css";
import RecommendationCard from "../components/Recommendation";

export default function UserHome() {
  const { user } = useUser();
  const [recommendations, setRecommendations] = useState({
    MOVIE: { items: [] },
    BOOK: { items: [] },
    MUSIC: { items: [] },
  });

  useEffect(() => {
    if (!user) return;
    api
      .get(`/recommendations/home`, { params: { userId: user.id } })
      .then((res) => {
        // 소문자 API 키 → 대문자 매핑
        setRecommendations({
          MOVIE: res.data.movie,
          BOOK: res.data.book,
          MUSIC: res.data.music,
        });
      })
      .catch((err) => console.error(err));
  }, [user]);

  if (!user) return <p>로그인 후 추천을 확인할 수 있습니다.</p>;

  return (
    <main>
      <h1>오늘의 추천</h1>

      {["MOVIE", "BOOK", "MUSIC"].map((cat) => (
        <section key={cat} className="features-wrapper">
          <h2 className="section-title">
            {cat === "MOVIE"
              ? "🎬 영화 추천"
              : cat === "BOOK"
              ? "📚 책 추천"
              : "🎵 음악 추천"}
          </h2>

          <div className="features">
            {recommendations[cat]?.items?.map((item) => (
  <RecommendationCard key={item.itemId} item={item} category={cat} />
))}

          </div>
        </section>
      ))}
    </main>
  );
}
