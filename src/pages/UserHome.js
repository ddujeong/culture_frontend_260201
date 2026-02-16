import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "../style/UserHome.css"; // 경로 확인
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

  if (!user) return <p>로그인 후 추천을 확인할 수 있습니다.</p>;

  // ⭐ 데이터 필터링 함수 (백엔드 카테고리/장르 기준으로 섹션 분리)
  const getItemsByKey = (key) => {
    return recommendations[key]?.items || [];
  };
  // 보여줄 섹션 정의
  const sections = [
    { title: "🎬 영화 추천", key: "movie" },
    { title: "📺 드라마 추천", key: "drama" },
    { title: "🍱 예능 추천", key: "entertainment" },
    { title: "🏮 애니 추천", key: "animation" },
    { title: "📚 책 추천", key: "book" },
    { title: "🎵 음악 추천", key: "music" },
  ];

  return (
    <main className="user-home">
      <h1>오늘의 추천</h1>

      {sections.map((section) => {
        const items = getItemsByKey(section.key);
        // 데이터가 있는 섹션만 보여주거나, 없으면 없다고 표시
        return (
          <section key={`section-${section.key}`} className="features-wrapper">            <h2 className="section-title">{section.title}</h2>
            <div className="features">
              {items.length === 0 ? (
                <p className="empty-text">추천 데이터가 준비 중이에요.</p>
              ) : (
                items.map((item) => (
                  <RecommendationCard
                    key={`${item.itemId || item.id}-${section.key}`}
                    item={item}
                    category={item.category}
                  />
                ))
              )}
            </div>
          </section>
        );
      })}
    </main>
  );
}