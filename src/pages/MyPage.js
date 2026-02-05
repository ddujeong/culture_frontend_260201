import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useUser } from "../context/UserContext";
import "../style/MyPage.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const MyPage = () => {
  const { user } = useUser();
  const [userStats, setUserStats] = useState(null);
  const [dislikeGenres, setDislikeGenres] = useState([]);
  const [dislikeTags, setDislikeTags] = useState([]);
  const [reviewHistory, setReviewHistory] = useState([]);
  const [watchedList, setWatchedList] = useState([]);
  const [toWatchList, setToWatchList] = useState([]);
  const [ratingStats, setRatingStats] = useState([0,0,0,0,0]); // 1~5점별 count

  console.log(watchedList)
  useEffect(() => {
    if (!user) return;
    const userId = user.id;

    api.get(`/users/${userId}/stats`).then(res => {
      setUserStats(res.data);
      setDislikeGenres(res.data.dislikeGenres);
      setDislikeTags(res.data.dislikeTags);
      // 예시: ratingStats API에서 받아온 값
      setRatingStats(res.data.ratingCounts || [0,0,0,0,0]);
    });

    api.get(`/users/${userId}/reviews`).then(res => {
      setReviewHistory(res.data);
      setWatchedList(res.data.filter(r => r.rating > 0)); // 평점 준 건 본 영화
      setToWatchList([]); // 임시
    });
  }, [user]);

  if (!user) return <p>로그인 후 이용 가능합니다.</p>;
  if (!userStats) return <p>Loading...</p>;

  const handleDelete = (id) => {
    api.delete(`/users/reviews/${id}`)
      .then(() => setReviewHistory(prev => prev.filter(r => r.id !== id)))
      .catch(err => console.error(err));
  };

  const handleEdit = (id, rating, comment) => {
    const newRating = prompt("새 평점을 입력하세요:", rating);
    const newComment = prompt("새 코멘트를 입력하세요:", comment);
    if (newRating != null && newComment != null) {
      api.put(`/users/reviews/${id}`, { rating: Number(newRating), comment: newComment })
        .then(res => setReviewHistory(prev => prev.map(r => r.id === id ? res.data : r)))
        .catch(err => console.error(err));
    }
  };

  // Bar chart 데이터
  const ratingData = {
    labels: ['1점','2점','3점','4점','5점'],
    datasets: [{
      label: '별점 분포',
      data: ratingStats,
      backgroundColor: ['#e74c3c','#f39c12','#f1c40f','#2ecc71','#3498db']
    }]
  };

  return (
    <main className="mypage">

      {/* 1️⃣ 취향 요약 카드 */}
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

      {/* 2️⃣ 평점 통계 차트 */}
      <section className="mypage-section chart">
        <h2>평점 통계</h2>
        <Bar data={ratingData} />
      </section>

      {/* 3️⃣ 추천 제외 요소 */}
      <section className="mypage-section dislikes">
        <h2>추천에서 제외 중인 요소</h2>
        <div className="chip-group">
          {dislikeGenres.map((g, i) => (
            <span key={i} className="chip danger">{g}</span>
          ))}
          {dislikeTags.map((t, i) => (
            <span key={i} className="chip warning">{t}</span>
          ))}
          {dislikeGenres.length === 0 && dislikeTags.length === 0 && <p>없음</p>}
        </div>
      </section>

      {/* 4️⃣ 본 영화 / 볼 영화 */}
      <section className="mypage-section watched">
        <h2>본 영화</h2>
        {watchedList.length === 0 ? <p>본 영화가 없습니다.</p> :
          <ul className="item-list">
            {watchedList.map(item => (
              <li key={item.id}>{item.title} ⭐ {item.rating}</li>
            ))}
          </ul>
        }
        <h2>보고 싶은 영화</h2>
        {toWatchList.length === 0 ? <p>보고 싶은 영화가 없습니다.</p> :
          <ul className="item-list">
            {toWatchList.map(item => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        }
      </section>

      {/* 5️⃣ 리뷰 기록 */}
      <section className="mypage-section reviews">
        <h2>리뷰/평점 기록</h2>
        {reviewHistory.length === 0 ? (
          <p>작성한 리뷰가 없습니다.</p>
        ) : (
          <ul className="review-list">
            {reviewHistory.map(r => (
              <li key={r.id} className="review-item">
                <div className="review-header">
                  <strong>{r.title}</strong>
                  <span className="review-category">{r.category}</span>
                </div>
                <div className="review-body">
                  ⭐ {r.rating} / 5
                  <p>{r.comment}</p>
                  <div className="review-actions">
                    <button onClick={() => handleEdit(r.id, r.rating, r.comment)}>수정</button>
                    <button onClick={() => handleDelete(r.id)}>삭제</button>
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
