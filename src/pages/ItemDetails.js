// ItemDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../style/ItemDetail.css";
import { useUser } from "../context/UserContext";

// ⭐ 별점 컴포넌트
const StarRating = ({ rating, setRating }) => {
  return (
    <div className="star-rating">
      {Array.from({ length: 5 }).map((_, idx) => (
        <span
          key={idx}
          className={idx < rating ? "active" : ""}
          onMouseEnter={() => setRating(idx + 1)}
          onClick={() => setRating(idx + 1)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [actionStatus, setActionStatus] = useState(null);

  // 1️⃣ 아이템 정보 fetch
  useEffect(() => {
    api.get(`/items/${id}`, { params: { userId: user?.id } })
      .then(res => { setItem(res.data); console.log(res.data) })
      .catch(err => {
        console.error(err);
        alert("아이템 정보를 불러오지 못했습니다.");
        navigate(-1);
      });
  }, [id, navigate, user?.id]);

  // 2️⃣ 사용자 액션 상태 fetch
  useEffect(() => {
    if (!user) return;
    api.get(`/action/${user.id}/item/${id}`)
      .then(res => setActionStatus(res.data.status))
      .catch(() => setActionStatus(null));
  }, [user, id]);

  // 3️⃣ 리뷰 fetch
  const fetchReviews = () => {
    api.get(`/reviews/item/${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));
  };
  useEffect(() => { fetchReviews(); }, [id]);

  // 4️⃣ 찜 등록
  const handleReserve = () => {
    api.post(`/action/${user.id}/reserve`, null, { params: { itemId: item.id } })
      .then(() => setActionStatus("RESERVE"))
      .catch(console.error);
  };

  // 5️⃣ 시청 완료 처리
  const handleWatched = () => {
    api.post(`/action/${user.id}/watched`, null, { params: { itemId: item.id } })
      .then(() => setActionStatus("WATCHED"))
      .catch(console.error);
  };

  // 6️⃣ 리뷰 작성
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("로그인 후 작성 가능합니다.");

    try {
      // 리뷰 작성
      await api.post(`/reviews`, {
        userId: user.id,
        itemId: item.id,
        rating: newReview.rating,
        comment: newReview.comment
      });

      // 시청 완료 처리
      await api.post(`/action/${user.id}/watched`, null, { params: { itemId: item.id } });

      // REVIEWED 처리
      await api.post(`/action/${user.id}/reviewed`, null, { params: { itemId: item.id } });

      // 상태 즉시 업데이트
      setActionStatus("REVIEWED");
      setNewReview({ rating: 5, comment: "" });
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert("리뷰 작성 실패");
    }
  };

  if (!item) return <p>로딩 중...</p>;

  // 별점 시각화
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < Math.round(item.averageRating) ? "★" : "☆"
  );
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.round(rating) ? "star active" : "star"}>
        {i < Math.round(rating) ? "★" : "☆"}
      </span>
    ));
  };
  return (
    <div className="item-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← 뒤로가기</button>

      <div className="item-detail-card">
        <img
          src={item.img || "https://via.placeholder.com/300x400"}
          alt={item.title}
          className="item-detail-img"
        />
        <div className="item-detail-info">
          <h1>{item.title}</h1>

          {/* 평점 표시 영역 개선 */}
          <div className="rating-container">
            {/* 1. 외부 서비스 평점 (가져온 데이터) */}
            <div className="rating-box">
              <small>TMDB 평점</small>
              <div className="stars">
                {/* 10점 만점인 데이터를 2로 나눠서 5점 별점으로 표시 */}
                {renderStars(item.externalRating / 2)}
                <span>({(item.externalRating / 2).toFixed(1)})</span>
              </div>
            </div>

            {/* 2. 우리 서비스 유저 평균 평점 */}
            <div className="rating-box">
              <small>우리 유저 평균</small>
              <div className="stars">
                {renderStars(item.averageRating)}
                <span>({item.averageRating.toFixed(1)})</span>
              </div>
            </div>

            {/* 3. 내가 남긴 평점 (리뷰를 이미 썼을 경우) */}
            {actionStatus === "REVIEWED" && (
              <div className="rating-box my-rating">
                <small>내 평점</small>
                <div className="stars highlight">
                  {/* 현재 유저가 남긴 리뷰 데이터를 찾아서 표시 */}
                  {renderStars(reviews.find(r => r.userId === user?.id)?.rating || 0)}
                </div>
              </div>
            )}
          </div>
          {item.recommendationReason && (
            <div className="recommend-reason-box">
              <strong>✨ 추천 이유</strong>
              <p>{item.recommendationReason.message}</p>
            </div>
          )}

          <div className="item-metadata">
            <p>
              <strong>장르:</strong> {item.genre} |{" "}
              <strong>{item.itemType === "STATIC" ? "발매일" : "개봉년도"}:</strong>{" "}
              {item.releaseDate?.slice(0, 4) || "정보 없음"}
            </p>
            {item.itemType === "VIDEO" && (
              <>
                <p><strong>감독:</strong> {item.director || "정보 없음"}</p>
                <p><strong>출연:</strong> {item.cast || "정보 없음"}</p>
                {item.runtime > 0 && <p><strong>러닝타임:</strong> {item.runtime}분</p>}
                {item.totalSeasons > 0 && (
                  <p><strong>시즌 정보:</strong> 총 {item.totalSeasons}시즌 ({item.totalEpisodes}개 에피소드)</p>
                )}
                {item.originCountry && <p><strong>제작국가:</strong> {item.originCountry}</p>}
              </>
            )}

            {/* 🎵 StaticContent (음악) 전용 정보 */}
            {item.itemType === "STATIC" && (
              <>
                <p><strong>아티스트:</strong> {item.creator || "정보 없음"}</p>
                <p><strong>앨범명:</strong> {item.albumName || "정보 없음"}</p>
              </>
            )}
          </div>
          <p className="item-description">{item.description || "설명 없음"}</p>

          {item.otts && item.otts.length > 0 && (
            <div className="otts">
              <strong>시청 가능 OTT:</strong>
              <div className="ott-buttons">
                {item.otts.map((ott, idx) => (
                  <a key={idx} href={ott.url} target="_blank" rel="noopener noreferrer" className="ott-btn" style={{ backgroundColor: ott.color }}>
                    <img src={ott.logoUrl} alt={ott.name} />
                    {ott.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 사용자 액션 버튼 */}
          {user && (
            <div className="action-buttons">
              {!actionStatus && (
                <button onClick={handleReserve} className="action-btn">🤍 찜하기</button>
              )}
              {actionStatus === "RESERVE" && (
                <button onClick={handleWatched} className="action-btn">👀 시청 완료</button>
              )}
              {actionStatus === "WATCHED" && (
                <button onClick={handleSubmitReview} className="action-btn">✍️ 리뷰 작성</button>
              )}
              {actionStatus === "REVIEWED" && <span className="done-text">✅ 리뷰 완료</span>}
            </div>
          )}
        </div>
      </div>

      {/* 리뷰 섹션 */}
      <section className="reviews-section">
        {user && actionStatus !== "REVIEWED" && (
          <form className="review-form" onSubmit={handleSubmitReview}>
            <h3>리뷰 작성</h3>
            <label>
              평점:
              <StarRating rating={newReview.rating} setRating={(rate) => setNewReview({ ...newReview, rating: rate })} />
            </label>
            <label>
              코멘트:
              <input
                type="text"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                required
              />
            </label>
            <button type="submit">작성</button>
          </form>
        )}

        <h2>리뷰 ({reviews.length})</h2>
        <ul className="reviews-list">
          {reviews.map(r => (
            <li key={r.id} className={user && r.userId === user.id ? "my-review" : ""}>
              <strong>{r.username}</strong> ({r.rating}/5): {r.comment}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
