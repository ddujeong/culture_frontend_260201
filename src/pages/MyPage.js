import "../style/MyPage.css";

const MyPage = () => {
  const userStats = {
    avgRating: 3.8,
    totalReviews: 12,
    favoriteCategory: "MOVIE",
  };

  const dislikeGenres = ["HORROR", "DOCUMENTARY"];
  const dislikeTags = ["MOOD_DARK", "SLOW"];

  const reviewHistory = [
    {
      title: "인셉션",
      category: "MOVIE",
      rating: 5,
      comment: "몰입감 최고",
    },
    {
      title: "어두운 다큐",
      category: "MOVIE",
      rating: 2,
      comment: "너무 우울함",
    },
  ];

  return (
    <main className="mypage">
      <h1 className="mypage-title">마이페이지</h1>

      {/* Summary */}
      <section className="mypage-section">
        <h2>내 취향 요약</h2>
        <div className="summary-cards">
          <div className="summary-card">
            <span>평균 별점</span>
            <strong>{userStats.avgRating}</strong>
          </div>
          <div className="summary-card">
            <span>총 기록</span>
            <strong>{userStats.totalReviews}</strong>
          </div>
          <div className="summary-card">
            <span>선호 카테고리</span>
            <strong>{userStats.favoriteCategory}</strong>
          </div>
        </div>
      </section>

      {/* Dislike */}
      <section className="mypage-section">
        <h2>추천에서 제외 중인 요소</h2>
        <div className="chip-group">
          {dislikeGenres.map((g, i) => (
            <span key={i} className="chip danger">{g}</span>
          ))}
          {dislikeTags.map((t, i) => (
            <span key={i} className="chip warning">{t}</span>
          ))}
        </div>
      </section>

      {/* History */}
      <section className="mypage-section">
        <h2>내 기록</h2>
        <ul className="review-list">
          {reviewHistory.map((r, i) => (
            <li key={i} className="review-item">
              <div>
                <strong>{r.title}</strong>
                <span className="review-category">{r.category}</span>
              </div>
              <div className="review-meta">
                ⭐ {r.rating} / 5
                <p>{r.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default MyPage;
