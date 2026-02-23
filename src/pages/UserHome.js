import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "../style/UserHome.css";
import { useUser } from "../context/UserContext";
import RecommendationCard from "../components/Recommendation";

export default function UserHome() {
  const { user } = useUser();
  const [recommendations, setRecommendations] = useState({
    movie: { items: [] },
    drama: { items: [] },
    entertainment: { items: [] },
    animation: { items: [] },
    book: { items: [] },
    music: { items: [] },
  });

  useEffect(() => {
    if (!user?.id) return;
    api
      .get(`/recommendations/home`, { params: { userId: user.id } })
      .then((res) => {
        setRecommendations({
          movie: res.data.movie || { items: [] },
          drama: res.data.drama || { items: [] },
          entertainment: res.data.entertainment || { items: [] },
          animation: res.data.animation || { items: [] },
          book: res.data.book || { items: [] },
          music: res.data.music || { items: [] },
        });
      })
      .catch((err) => console.error(err));
  }, [user?.id]);

  if (!user) return <div className="user-home-error">로그인 후 추천을 확인할 수 있습니다.</div>;

  const sections = [
    { title: "영화", emoji: "🎬", key: "movie" },
    { title: "드라마", emoji: "📺", key: "drama" },
    { title: "예능", emoji: "🍱", key: "entertainment" },
    { title: "애니메이션", emoji: "🏮", key: "animation" },
    { title: "도서", emoji: "📚", key: "book" },
    { title: "음악", emoji: "🎵", key: "music" },
  ];

  return (
    <main className="user-home">
      {/* 웰컴 섹션: 유저 개인화 강조 */}
      <header className="user-welcome">
        <span className="user-tag">For You</span>
        <h1><span>{user.username || '유저'}</span>님을 위한 <br />오늘의 취향 큐레이션</h1>
      </header>

      <div className="user-home-content">
        {sections.map((section) => {
          const items = recommendations[section.key]?.items || [];
          if (items.length === 0) return null; // 데이터 없는 섹션은 과감히 숨김 (깔끔함 유지)

          return (
            <section key={section.key} className="user-section">
              <div className="section-header">
                <h2>{section.emoji} {section.title}</h2>
                <button className="refresh-btn">맞춤형 더보기</button>
              </div>

              {/* 가로 스크롤 형태의 피드 */}
              <div className="recommendation-feed">
                {items.map((item) => (
                  <div className="card-wrapper" key={`${item.itemId || item.id}-${section.key}`}>
                    <RecommendationCard
                      item={item}
                      category={item.category}
                    />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}