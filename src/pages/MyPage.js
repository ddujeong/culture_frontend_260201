// MyPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useUser } from "../context/UserContext";
import "../style/MyPage.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const categories = ["MOVIE", "DRAMA", "TV_SHOW", "ANIMATION", "BOOK", "MUSIC"];

const categoryLabels = {
  MOVIE: "영화",
  DRAMA: "시리즈",
  TV_SHOW: "예능",
  ANIMATION: "애니메이션",
  BOOK: "도서",
  MUSIC: "음악"
};
const MyPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [userStats, setUserStats] = useState(null);
  const [dislikeGenres, setDislikeGenres] = useState([]);
  const [dislikeTags, setDislikeTags] = useState([]);
  const [reviewHistory, setReviewHistory] = useState([]);
  const [watchedList, setWatchedList] = useState([]);
  const [reservedList, setReservedList] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("MOVIE");
  const [avgRatingByGenre, setAvgRatingByGenre] = useState({});
  const [selectedReviewCategory, setSelectedReviewCategory] = useState("MOVIE");

  const filteredReviews = reviewHistory.filter(r => r.category === selectedReviewCategory);

  useEffect(() => {
    if (!user) return;
    const userId = user.id;

    // 보고싶어요, 본 콘텐츠 가져오기
    api.get(`/action/${userId}/reserve`).then(res => setReservedList(res.data)).catch(console.error);
    api.get(`/action/${userId}/watched`).then(res => setWatchedList(res.data)).catch(console.error);

    // 유저 통계
    api.get(`/users/${userId}/stats`).then(res => {
      setUserStats(res.data);
      setDislikeGenres(res.data.dislikeGenres || []);
      setDislikeTags(res.data.dislikeTags || []);
    }).catch(console.error);

    // 리뷰 기록
    api.get(`/users/${userId}/reviews`).then(res => setReviewHistory(res.data)).catch(console.error);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    api.get(`/users/${user.id}/avg-rating`, { params: { category: selectedCategory } })
      .then(res => setAvgRatingByGenre(res.data))
      .catch(console.error);
  }, [user, selectedCategory]);

  if (!user || !userStats) return <p>Loading...</p>;

  const handleDelete = (id) => {
    api.delete(`/users/reviews/${id}`)
      .then(() => setReviewHistory(prev => prev.filter(r => r.id !== id)))
      .catch(console.error);
  };

  const handleEdit = (id, rating, comment) => {
    const newRating = prompt("새 평점을 입력하세요:", rating);
    const newComment = prompt("새 코멘트를 입력하세요:", comment);
    if (newRating != null && newComment != null) {
      api.put(`/users/reviews/${id}`, { rating: Number(newRating), comment: newComment })
        .then(res => setReviewHistory(prev => prev.map(r => r.id === id ? res.data : r)))
        .catch(console.error);
    }
  };

  const categoryChartData = {
    labels: Object.keys(avgRatingByGenre),
    datasets: [{
      label: `${selectedCategory} 장르별 평균 평점`,
      data: Object.values(avgRatingByGenre),
      backgroundColor: "#6366f1"
    }]
  };

  const categoryChartOptions = {
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: { x: { beginAtZero: true, max: 5 } }
  };

  return (
    <main className="mypage">
      {/* 1️⃣ 취향 요약 */}
      <section className="mypage-section stats">
        <h2>내 취향 요약</h2>
        <div className="summary-cards">
          <div className="summary-card">
            <span>평균 별점</span>
            <strong>{userStats.avgRating?.toFixed(1)}</strong>
          </div>
          <div className="summary-card">
            <span>총 기록</span>
            <strong>{userStats.totalReviews}</strong>
          </div>
          <div className="summary-card">
            <span>선호 카테고리</span>
            <strong>{userStats.favoriteCategory || "없음"}</strong>
          </div>
        </div>
      </section>

      {/* 2️⃣ 카테고리별 평균 평점 */}
      <section className="mypage-section chart">
        <h2>카테고리별 평균 평점</h2>
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={selectedCategory === cat ? "active" : ""}
              onClick={() => setSelectedCategory(cat)}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
        <Bar data={categoryChartData} options={categoryChartOptions} />
      </section>

      {/* 3️⃣ 추천 제외 요소 */}
      <section className="mypage-section dislikes">
        <h2>추천 제외 요소</h2>
        <div className="chip-group">
          {dislikeGenres.map((g, i) => <span key={i} className="chip danger">{g}</span>)}
          {dislikeTags.map((t, i) => <span key={i} className="chip warning">{t}</span>)}
          {dislikeGenres.length === 0 && dislikeTags.length === 0 && <p>없음</p>}
        </div>
      </section>

      {/* 4️⃣ 본 콘텐츠 */}
      <section className="mypage-section watched">
        <h2>본 콘텐츠</h2>
        {watchedList.length === 0 ? (
          <p>아직 본 콘텐츠가 없습니다.</p>
        ) : (
          <ul className="item-list">
            {watchedList.map(item => {
              // 리뷰 작성 여부 확인
              const isReviewed = reviewHistory.some(r => r.itemId === item.itemId);

              return (
                <li
                  key={item.actionId}
                  className="clickable-item"
                  onClick={() => navigate(`/items/${item.itemId}`)}
                >
                  <strong>{item.title}</strong>
                  <span className="category">{item.category}</span>
                  <span className={`review-status ${isReviewed ? "done" : "pending"}`}>
                    {isReviewed ? "✅ 리뷰 완료" : "✍️ 리뷰 작성 필요"}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* 5️⃣ 보고 싶은 콘텐츠 */}
      <section className="mypage-section reserved">
        <h2>보고 싶은 콘텐츠</h2>
        {reservedList.length === 0 ? <p>보고 싶은 콘텐츠가 없습니다.</p> :
          <ul className="item-list">
            {reservedList.map(item => (
              <li
                key={item.actionId}
                className="clickable-item"
                onClick={() => navigate(`/items/${item.itemId}`)}
              >
                <strong>{item.title}</strong>
                <span className="category">{item.category}</span>
              </li>
            ))}
          </ul>}
      </section>

      {/* 6️⃣ 리뷰 기록 */}
      <section className="mypage-section reviews">
        <h2>리뷰/평점 기록</h2>

        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={selectedReviewCategory === cat ? "active" : ""}
              onClick={() => setSelectedReviewCategory(cat)}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {filteredReviews.length === 0 ? (
          <p>작성한 리뷰가 없습니다.</p>
        ) : (
          <ul className="review-list">
            {filteredReviews.map(r => (
              <li
                key={r.id}
                className="review-item clickable-item"
                onClick={() => navigate(`/items/${r.itemId}`)}
              >
                <div className="review-header">
                  <strong>{r.title}</strong>
                  <span className="review-category">{r.category}</span>
                </div>
                <div className="review-body">
                  ⭐ {r.rating} / 5
                  <p>{r.comment}</p>
                  <div className="review-actions">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(r.id, r.rating, r.comment); }}>수정</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}>삭제</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default MyPage;
